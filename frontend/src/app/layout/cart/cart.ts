import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";
import { interval, Subject, takeUntil } from "rxjs";

import { ICart } from "../../core/models/cart.model";
import { CartService } from "../../core/services/cart.service";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./cart.html",
  styleUrl: "./cart.css",
})
export class Cart implements OnInit, OnDestroy {
  cart: ICart | null = null;
  errorMessage = "";
  showPriceChangeNotice = false;
  isAcceptingPriceChange = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.cart = cart;
      this.showPriceChangeNotice = this.hasPriceChanges();
      this._cdr.detectChanges();
    });

    this.loadCart();

    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadCart());
  }

  loadCart(): void {
    this.errorMessage = "";

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.showPriceChangeNotice = this.hasPriceChanges();
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || err?.message || "Unable to load cart.";
        this._cdr.detectChanges();
      },
    });
  }

  hasPriceChanges(): boolean {
    return !!this.cart?.items.some((item) => item.priceChanged);
  }

  getChangedItems() {
    return this.cart?.items.filter((item) => item.priceChanged) || [];
  }

  acceptPriceChange(): void {
    if (this.isAcceptingPriceChange) {
      return;
    }

    this.isAcceptingPriceChange = true;

    this.cartService.acceptPriceChange().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.showPriceChangeNotice = false;
        this.isAcceptingPriceChange = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          "Unable to accept the new price.";
        this.isAcceptingPriceChange = false;
        this._cdr.detectChanges();
      },
    });
  }

  rejectPriceChange(): void {
    if (this.isAcceptingPriceChange) {
      return;
    }

    this.isAcceptingPriceChange = true;

    this.cartService.clearCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.showPriceChangeNotice = false;
        this.isAcceptingPriceChange = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          "Unable to clear the cart.";
        this.isAcceptingPriceChange = false;
        this._cdr.detectChanges();
      },
    });
  }

  increase(productId: string, quantity: number): void {
    this.update(productId, quantity + 1);
  }

  decrease(productId: string, quantity: number): void {
    if (quantity <= 1) {
      this.remove(productId);
      return;
    }
    this.update(productId, quantity - 1);
  }

  update(productId: string, quantity: number): void {
    this.cartService.updateCartItem(productId, quantity).subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || err?.message || "Unable to update cart.";
        this._cdr.detectChanges();
      },
    });
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || err?.message || "Unable to remove item.";
        this._cdr.detectChanges();
      },
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || err?.message || "Unable to clear cart.";
        this._cdr.detectChanges();
      },
    });
  }

  getSubtotal(): number {
    return (
      this.cart?.items.reduce(
        (total, item) =>
          total +
          Number(item.priceAtAdd || item.product.price || 0) *
            Number(item.quantity || 0),
        0,
      ) || 0
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
