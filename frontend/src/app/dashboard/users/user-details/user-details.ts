import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import { DatePipe } from "@angular/common";

import { IUser, IUserHistory } from "../../../core/models/user.model";
import { UserService } from "../../../core/services/user.service";

@Component({
  selector: "app-user-details",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./user-details.html",
  styleUrl: "./user-details.css",
})
export class UserDetails implements OnInit {
  user: IUser | null = null;

  userId = "";

  errorMessage = "";
  history: IUserHistory["history"] = {
    orders: [],
    refunds: [],
    testimonials: [],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id") || "";

    if (!this.userId) {
      this.errorMessage = "User id not found";

      this._cdr.detectChanges();

      return;
    }

    this.getUser(this.userId);
  }

  getUser(id: string): void {
    this.errorMessage = "";

    this.userService.getUserById(id).subscribe({
      next: (user: IUser) => {
        this.user = user;
        this.loadHistory(id);

        this._cdr.detectChanges();
      },

      error: (err: any) => {
        this.errorMessage = err?.error?.message || "Failed to load user";

        this._cdr.detectChanges();
      },
    });
  }

  loadHistory(id: string): void {
    this.userService.getUserHistory(id).subscribe({
      next: (data: IUserHistory) => {
        this.history = data?.history || {
          orders: [],
          refunds: [],
          testimonials: [],
        };
        this._cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Failed to load user history:", err);
        this._cdr.detectChanges();
      },
    });
  }

  getInitial(): string {
    return this.user?.name?.charAt(0)?.toUpperCase() || "U";
  }

  getStatus(): string {
    if (this.user?.isBlocked) {
      return "BLOCKED";
    }

    if (!this.user?.isActive) {
      return "INACTIVE";
    }

    return "ACTIVE";
  }

  getStatusClass(): string {
    if (this.user?.isBlocked) {
      return "blocked";
    }

    if (!this.user?.isActive) {
      return "inactive";
    }

    return "active";
  }

  goBack(): void {
    this.router.navigate(["/dashboard/users"]);
  }
}
