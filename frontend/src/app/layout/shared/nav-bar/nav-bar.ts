import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";

import { RouterLink, RouterLinkActive } from "@angular/router";

import { Subject, takeUntil } from "rxjs";

import { PromoBanner } from "../promo-banner/promo-banner";

import { AuthService } from "../../../core/services/auth.service";
import { IUser } from "../../../core/models/auth.model";

import { CartService } from "../../../core/services/cart.service";

import { CategoryService } from "../../../core/services/category.service";
import { ICategory } from "../../../core/models/category.model";

@Component({
  selector: "app-nav-bar",

  standalone: true,

  imports: [RouterLink, RouterLinkActive, PromoBanner],

  templateUrl: "./nav-bar.html",

  styleUrl: "./nav-bar.css",
})
export class Navbar implements OnInit, OnDestroy {
  @Output()
  cartClick = new EventEmitter<void>();

  user: IUser | null = null;

  categories: ICategory[] = [];

  cartCount = 0;

  menuOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private _cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.user = user;

        this.updateCartCount();
      },

      error: (error) => {
        console.error("Navbar user error:", error);

        this.user = null;
      },
    });

    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (cart) => {
        if (!cart) {
          this.cartCount = 0;

          return;
        }

        this.cartCount = cart.items.reduce(
          (total, item) => total + Number(item.quantity || 0),

          0,
        );
      },

      error: (error) => {
        console.error("Navbar cart error:", error);

        this.cartCount = 0;
      },
    });

    this.loadNavbarCategories();
  }

  private loadNavbarCategories(): void {
    this.categoryService
      .getHomeCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this._cdr.detectChanges()
        },

        error: (error) => {
          console.error("Navbar categories error:", error);

          this.categoryService
            .getAllCategories()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (categories) => {
                this.categories = categories.filter(
                  (category) => category.isActive && !category.isDeleted,
                );

                console.log("Navbar fallback categories:", this.categories);
              },

              error: (fallbackError) => {
                console.error(
                  "Navbar categories fallback error:",
                  fallbackError,
                );

                this.categories = [];
              },
            });
        },
      });
  }

  openCart(): void {
    this.cartClick.emit();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();

    this.user = null;

    this.cartCount = 0;

    this.menuOpen = false;
  }

  updateCartCount(): void {
    if (!this.authService.isLoggedIn()) {
      const guestCart = this.cartService.loadGuestCart();

      this.cartCount = guestCart.items.reduce(
        (total, item) => total + Number(item.quantity || 0),

        0,
      );

      return;
    }

    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cartCount = cart.items.reduce(
            (total, item) => total + Number(item.quantity || 0),

            0,
          );
        },

        error: (error) => {
          console.error("Cart count error:", error);

          this.cartCount = 0;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
