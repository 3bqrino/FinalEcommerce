import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  EMPTY,
  Subject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  catchError,
} from "rxjs";

import { IUser } from "../../../core/models/user.model";
import { UserService } from "../../../core/services/user.service";
import { UserCard } from "../user-card/user-card";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [ReactiveFormsModule, UserCard],
  templateUrl: "./user-list.html",
  styleUrl: "./user-list.css",
})
export class UserList implements OnInit, OnDestroy {
  users: IUser[] = [];
  errorMessage = "";
  successMessage = "";
  showAdminForm = false;
  isLoading = false;
  isCreatingAdmin = false;
  searchTerm = "";
  totalUsers = 0;
  currentPage = 1;
  totalPages = 1;
  readonly pageSize = 12;

  readonly pageNumbers: number[] = [];

  adminForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    nationalId: "",
    gender: "male" as "male" | "female",
    dateOfBirth: "",
  };

  readonly searchForm = new FormGroup({
    searchTerm: new FormControl("", { nonNullable: true, updateOn: "change" }),
  });

  readonly adminReactiveForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: "change",
    }),
    phone: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    nationalId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    gender: new FormControl<"male" | "female">("male", {
      nonNullable: true,
      updateOn: "change",
    }),
    dateOfBirth: new FormControl("", { nonNullable: true, updateOn: "change" }),
  });

  private readonly searchInput$ = new Subject<string>();

  constructor(
    private userService: UserService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => {
      const value = this.searchForm.getRawValue();

      this.searchTerm = value.searchTerm;
    });

    this.adminReactiveForm.valueChanges.subscribe(() => {
      const value = this.adminReactiveForm.getRawValue();

      this.adminForm = {
        name: value.name,
        email: value.email,
        password: value.password,
        phone: value.phone,
        nationalId: value.nationalId,
        gender: value.gender,
        dateOfBirth: value.dateOfBirth,
      };
    });

    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          this.loadUsers$(term, 1).pipe(
            catchError((err) => {
              this.handleLoadError(err);
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe((result) => this.applyUsersPage(result));

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.searchInput$.complete();
  }

  onSearchInput(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.searchInput$.next(this.searchTerm.trim());
  }

  submitSearch(): void {
    const term = this.searchTerm.trim();
    this.searchInput$.next(term);
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.searchForm.controls.searchTerm.setValue("");
    this.searchInput$.next("");
  }

  loadUsers(page = this.currentPage): void {
    this.subscribeToUsers(this.loadUsers$(this.searchTerm.trim(), page));
  }

  private loadUsers$(search: string, page: number) {
    this.isLoading = true;
    this.errorMessage = "";

    return this.userService
      .getUsers({
        search,
        page,
        limit: this.pageSize,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this._cdr.detectChanges();
        }),
      );
  }

  applyUsersPage(result: {
    users: IUser[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
    };
  }): void {
    this.users = result.users || [];
    this.currentPage = result.pagination?.page || 1;
    this.totalPages = Math.max(result.pagination?.totalPages || 1, 1);
    this.totalUsers = result.pagination?.total || 0;
    this.updatePageNumbers();
    this._cdr.detectChanges();
  }

  private subscribeToUsers(request: ReturnType<UserService["getUsers"]>): void {
    request.subscribe({
      next: (result) => this.applyUsersPage(result),
      error: (err) => this.handleLoadError(err),
    });
  }

  private handleLoadError(err: any): void {
    this.errorMessage = err?.error?.message || "Failed to load users.";
    this.users = [];
    this.totalUsers = 0;
    this.totalPages = 1;
    this.currentPage = 1;
    this.updatePageNumbers();
    this._cdr.detectChanges();
  }

  toggleAdminForm(): void {
    this.showAdminForm = !this.showAdminForm;
    this.errorMessage = "";
    this.successMessage = "";
  }

  createAdmin(): void {
    this.adminReactiveForm.markAllAsTouched();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.adminReactiveForm.invalid) {
      if (
        !this.adminForm.name.trim() ||
        !this.adminForm.email.trim() ||
        !this.adminForm.password ||
        !this.adminForm.phone.trim() ||
        !this.adminForm.nationalId.trim()
      ) {
        this.errorMessage = "Please complete all admin fields.";
        return;
      }

      if (this.adminForm.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters.";
        return;
      }
    }

    if (
      !this.adminForm.name.trim() ||
      !this.adminForm.email.trim() ||
      !this.adminForm.password ||
      !this.adminForm.phone.trim() ||
      !this.adminForm.nationalId.trim()
    ) {
      this.errorMessage = "Please complete all admin fields.";
      return;
    }

    if (this.adminForm.password.length < 6) {
      this.errorMessage = "Password must be at least 6 characters.";
      return;
    }

    this.isCreatingAdmin = true;

    this.userService
      .createAdmin({
        ...this.adminForm,
        dateOfBirth: this.adminForm.dateOfBirth || null,
      })
      .pipe(
        finalize(() => {
          this.isCreatingAdmin = false;
          this._cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = "Admin account created successfully.";
          this.showAdminForm = false;
          this.resetAdminForm();
          this.loadUsers(1);
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || "Failed to create admin account.";
        },
      });
  }

  removeUser(id: string): void {
    this.users = this.users.filter((user) => user._id !== id);
    this.totalUsers = Math.max(this.totalUsers - 1, 0);

    if (this.users.length === 0 && this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
      return;
    }

    this.updatePageNumbers();
    this._cdr.detectChanges();
  }

  goToPage(page: number): void {
    if (
      this.isLoading ||
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.searchTerm = this.searchTerm.trim();
    this.loadUsers(page);
  }

  private resetAdminForm(): void {
    this.adminForm = {
      name: "",
      email: "",
      password: "",
      phone: "",
      nationalId: "",
      gender: "male",
      dateOfBirth: "",
    };

    this.adminReactiveForm.reset({
      name: "",
      email: "",
      password: "",
      phone: "",
      nationalId: "",
      gender: "male",
      dateOfBirth: "",
    });
  }

  private updatePageNumbers(): void {
    const visiblePages = 5;
    const start = Math.max(
      1,
      Math.min(
        this.currentPage - 2,
        Math.max(this.totalPages - visiblePages + 1, 1),
      ),
    );
    const end = Math.min(this.totalPages, start + visiblePages - 1);

    this.pageNumbers.splice(
      0,
      this.pageNumbers.length,
      ...Array.from({ length: end - start + 1 }, (_, index) => start + index),
    );
  }
}
