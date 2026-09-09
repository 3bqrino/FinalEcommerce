import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { RouterLink } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

import { IProfile } from "../../core/models/auth.model";

@Component({
  selector: "app-account",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./account.html",
  styleUrl: "./account.css",
})
export class Account implements OnInit {
  profile: IProfile | null = null;

  name = "";
  email = "";
  phone = "";
  nationalId = "";

  gender: "male" | "female" = "male";

  dateOfBirth = "";

  currentPassword = "";

  newPassword = "";

  confirmPassword = "";

  activeSection:
    "profile" | "security" | "addresses" | "testimonials" | "refunds" =
    "profile";

  errorMessage = "";

  successMessage = "";

  passwordError = "";

  passwordSuccess = "";

  profileForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
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

  passwordForm = new FormGroup({
    currentPassword: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    newPassword: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: "change",
    }),
    confirmPassword: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
  });

  constructor(
    private authService: AuthService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(() => {
      const value = this.profileForm.getRawValue();

      this.name = value.name;
      this.phone = value.phone;
      this.nationalId = value.nationalId;
      this.gender = value.gender;
      this.dateOfBirth = value.dateOfBirth;
    });

    this.passwordForm.valueChanges.subscribe(() => {
      const value = this.passwordForm.getRawValue();

      this.currentPassword = value.currentPassword;
      this.newPassword = value.newPassword;
      this.confirmPassword = value.confirmPassword;
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getMyProfile().subscribe({
      next: (res) => {
        this.profile = res?.data?.user || null;

        if (!this.profile) {
          this.errorMessage = "Profile data not found.";

          this._cdr.detectChanges();

          return;
        }

        this.name = this.profile.name || "";

        this.email = this.profile.email || "";

        this.phone = this.profile.phone || "";

        this.nationalId = this.profile.nationalId || "";

        this.gender = this.profile.gender || "male";

        this.dateOfBirth = this.profile.dateOfBirth
          ? this.formatDate(this.profile.dateOfBirth)
          : "";

        this.errorMessage = "";
        this.profileForm.patchValue(
          {
            name: this.name,
            phone: this.phone,
            nationalId: this.nationalId,
            gender: this.gender,
            dateOfBirth: this.dateOfBirth,
          },
          { emitEvent: false },
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Profile error:", err);

        this.errorMessage = err?.error?.message || "Failed to load profile";

        this._cdr.detectChanges();
      },
    });
  }

  formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  }

  setSection(
    section: "profile" | "security" | "addresses" | "testimonials" | "refunds",
  ): void {
    this.activeSection = section;

    this.errorMessage = "";

    this.successMessage = "";

    this.passwordError = "";

    this.passwordSuccess = "";

    this._cdr.detectChanges();
  }

  saveProfile(): void {
    this.profileForm.markAllAsTouched();
    this.errorMessage = "";

    this.successMessage = "";

    if (this.profileForm.invalid) {
      if (!this.name.trim()) {
        this.errorMessage = "Name cannot be empty";

        this._cdr.detectChanges();

        return;
      }

      if (!this.phone.trim()) {
        this.errorMessage = "Phone cannot be empty";

        this._cdr.detectChanges();

        return;
      }

      if (!this.nationalId.trim()) {
        this.errorMessage = "National ID cannot be empty";

        this._cdr.detectChanges();

        return;
      }
    }

    if (!this.phone.trim()) {
      this.errorMessage = "Phone cannot be empty";

      this._cdr.detectChanges();

      return;
    }

    if (!this.nationalId.trim()) {
      this.errorMessage = "National ID cannot be empty";

      this._cdr.detectChanges();

      return;
    }

    this.authService
      .updateMyProfile({
        name: this.name.trim(),

        phone: this.phone.trim(),

        nationalId: this.nationalId.trim(),

        gender: this.gender,

        dateOfBirth: this.dateOfBirth || null,
      })
      .subscribe({
        next: (res) => {
          this.profile = res?.data?.user || null;

          this.successMessage = "Profile updated successfully";

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.error("Update profile error:", err);

          this.errorMessage = err?.error?.message || "Failed to update profile";

          this._cdr.detectChanges();
        },
      });
  }

  savePassword(): void {
    this.passwordForm.markAllAsTouched();
    this.passwordError = "";

    this.passwordSuccess = "";

    if (this.passwordForm.invalid) {
      if (!this.currentPassword) {
        this.passwordError = "Current password is required";

        this._cdr.detectChanges();

        return;
      }

      if (!this.newPassword) {
        this.passwordError = "New password is required";

        this._cdr.detectChanges();

        return;
      }

      if (this.newPassword.length < 6) {
        this.passwordError = "New password must be at least 6 characters";

        this._cdr.detectChanges();

        return;
      }
    }

    if (!this.newPassword) {
      this.passwordError = "New password is required";

      this._cdr.detectChanges();

      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = "New password must be at least 6 characters";

      this._cdr.detectChanges();

      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = "Passwords do not match";

      this._cdr.detectChanges();

      return;
    }

    this.authService
      .changeMyPassword({
        currentPassword: this.currentPassword,

        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.currentPassword = "";

          this.newPassword = "";

          this.confirmPassword = "";
          this.passwordForm.reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          this.passwordSuccess = "Password changed successfully";

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.error("Change password error:", err);

          this.passwordError =
            err?.error?.message || "Failed to change password";

          this._cdr.detectChanges();
        },
      });
  }
}
