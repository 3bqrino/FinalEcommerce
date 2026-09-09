import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { RouterLink } from "@angular/router";

import { IUser } from "../../../core/models/user.model";
import { UserService } from "../../../core/services/user.service";

@Component({
  selector: "app-user-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./user-card.html",
  styleUrl: "./user-card.css",
})
export class UserCard {
  @Input({ required: true }) user!: IUser;
  @Input() index = 0;

  @Output() userDeleted = new EventEmitter<string>();

  action = "";
  actionError = "";

  constructor(
    private userService: UserService,
    private _cdr: ChangeDetectorRef,
  ) {}

  getInitial(): string {
    return this.user?.name?.charAt(0)?.toUpperCase() || "U";
  }

  getStatus(): string {
    if (this.user.isBlocked) {
      return "BLOCKED";
    }

    if (!this.user.isActive) {
      return "INACTIVE";
    }

    return "ACTIVE";
  }

  getStatusClass(): string {
    if (this.user.isBlocked) {
      return "blocked";
    }

    if (!this.user.isActive) {
      return "inactive";
    }

    return "active";
  }

  getDate(): string {
    if (!this.user.createdAt) {
      return "—";
    }

    return new Date(this.user.createdAt)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }

  toggleBlock(): void {
    if (this.action) {
      return;
    }

    this.actionError = "";
    this.action = this.user.isBlocked ? "unblocking" : "blocking";
    const request = this.user.isBlocked
      ? this.userService.unblockUser(this.user._id)
      : this.userService.blockUser(this.user._id);

    request.subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.action = "";
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.actionError =
          err?.error?.message ||
          `Failed to ${this.user.isBlocked ? "unblock" : "block"} user.`;
        this.action = "";
        this._cdr.detectChanges();
      },
    });
  }

  deleteUser(): void {
    if (this.action) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${this.user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    this.actionError = "";
    this.action = "deleting";

    this.userService.deleteUser(this.user._id).subscribe({
      next: () => {
        this.userDeleted.emit(this.user._id);
        this.action = "";
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.actionError = err?.error?.message || "Failed to delete user.";
        this.action = "";
        this._cdr.detectChanges();
      },
    });
  }
}
