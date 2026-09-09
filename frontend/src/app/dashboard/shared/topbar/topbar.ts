import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { UpperCasePipe } from "@angular/common";
import { Router } from "@angular/router";

import { AuthService } from "../../../core/services/auth.service";
import { MessageService } from "../../../core/services/message.service";

@Component({
  selector: "app-topbar",
  standalone: true,
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: "./topbar.html",
  styleUrl: "./topbar.css",
})
export class Topbar implements OnInit, OnDestroy {
  userName = "ADMIN";
  userRole = "ADMIN";
  searchTerm = "";
  sidebarOpened = true;
  messageCount = 0;

  readonly searchForm = new FormGroup({
    searchTerm: new FormControl("", { nonNullable: true, updateOn: "change" }),
  });

  private readonly handleResize = (): void => {
    if (window.innerWidth <= 800 && this.sidebarOpened) {
      return;
    }

    if (window.innerWidth <= 800) {
      this.sidebarOpened = false;
      this.applySidebarState();
    }
  };

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => {
      const value = this.searchForm.getRawValue();

      this.searchTerm = value.searchTerm;
    });

    this.sidebarOpened = window.innerWidth > 800;
    this.applySidebarState();
    window.addEventListener("resize", this.handleResize, { passive: true });

    this.loadUser();
    this.messageService.startPolling();

    this.messageService.unreadCount$.subscribe((count) => {
      this.messageCount = count;
      this._cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.handleResize);
    this.messageService.stopPolling();
  }

  loadUser(): void {
    const user = this.authService.getUser();

    if (!user) {
      return;
    }

    this.userName = user.name || "ADMIN";
    this.userRole = user.role || "ADMIN";
    this._cdr.detectChanges();
  }

  getInitial(): string {
    return this.userName.trim().charAt(0).toUpperCase() || "A";
  }

  toggleSidebar(): void {
    this.sidebarOpened = !this.sidebarOpened;
    this.applySidebarState();
  }

  private applySidebarState(): void {
    document
      .querySelector(".dashboard-shell")
      ?.classList.toggle("sidebar-hidden", !this.sidebarOpened);
  }

  openMessages(): void {
    this.router.navigate(["/dashboard/messages"]);
  }

  logout(): void {
    this.messageService.stopPolling();
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  search(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return;
    }

    const routes: Record<string, string> = {
      product: "/dashboard/products",
      products: "/dashboard/products",
      order: "/dashboard/orders",
      orders: "/dashboard/orders",
      user: "/dashboard/users",
      users: "/dashboard/users",
      testimonial: "/dashboard/testimonials",
      testimonials: "/dashboard/testimonials",
      message: "/dashboard/messages",
      messages: "/dashboard/messages",
      category: "/dashboard/categories",
      categories: "/dashboard/categories",
      shipping: "/dashboard/shipping",
      refund: "/dashboard/refunds",
      refunds: "/dashboard/refunds",
      report: "/dashboard/reports",
      reports: "/dashboard/reports",
    };

    const route = Object.entries(routes).find(([keyword]) =>
      term.includes(keyword),
    )?.[1];

    if (route) {
      this.router.navigate([route]);
    }
  }
}
