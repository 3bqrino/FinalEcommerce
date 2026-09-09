import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink, RouterLinkActive } from "@angular/router";

import { UpperCasePipe } from "@angular/common";

import { MessageService } from "../../../core/services/message.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: "./sidebar.html",
  styleUrl: "./sidebar.css",
})
export class Sidebar implements OnInit {
  userName = "";
  userRole = "";

  messageCount = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUser();

    this.messageService.startPolling();

    this.messageService.unreadCount$.subscribe((count) => {
      this.messageCount = count;

      this._cdr.detectChanges();
    });
  }

  loadUser(): void {
    const user = this.authService.getUser();

    if (!user) {
      return;
    }

    this.userName = user.name || "";
    this.userRole = user.role || "";

    this._cdr.detectChanges();
  }

  getInitial(): string {
    return this.userName?.charAt(0)?.toUpperCase() || "A";
  }

  logout(): void {
    this.messageService.stopPolling();

    this.authService.logout();
  }
}
