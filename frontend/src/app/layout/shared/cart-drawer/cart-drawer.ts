import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";

import { RouterLink } from "@angular/router";

import { interval, Subject, takeUntil } from "rxjs";

import { ICart } from "../../../core/models/cart.model";
import { CartService } from "../../../core/services/cart.service";

@Component({
  selector: "app-cart-drawer",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./cart-drawer.html",
  styleUrl: "./cart-drawer.css",
})
export class CartDrawer implements OnInit, OnDestroy {
  @Output()
  closeDrawer = new EventEmitter<void>();

  cart: ICart | null = null;
  showPriceChangeNotice = false;
  isAcceptingPriceChange = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.showPriceChangeNotice = this.hasPriceChanges();

        this._cdr.detectChanges();
      },
    });

    this.getCart();

    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getCart());
  }

  getCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Cart drawer error:", err);

        this.cart = null;

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
        console.error("Accept price change error:", err);
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
        console.error("Clear cart after price change error:", err);
        this.isAcceptingPriceChange = false;
        this._cdr.detectChanges();
      },
    });
  }

  increase(productId: string, quantity: number): void {
    this.cartService.updateCartItem(productId, quantity + 1).subscribe({
      next: (cart) => {
        this.cart = cart;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Increase cart item error:", err);

        this._cdr.detectChanges();
      },
    });
  }

  decrease(productId: string, quantity: number): void {
    if (quantity <= 1) {
      this.remove(productId);
      return;
    }

    this.cartService.updateCartItem(productId, quantity - 1).subscribe({
      next: (cart) => {
        this.cart = cart;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Decrease cart item error:", err);

        this._cdr.detectChanges();
      },
    });
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (cart) => {
        this.cart = cart;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Remove cart item error:", err);

        this._cdr.detectChanges();
      },
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      next: (cart) => {
        this.cart = cart;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Clear cart error:", err);

        this._cdr.detectChanges();
      },
    });
  }

  getTotal(): number {
    if (!this.cart) {
      return 0;
    }

    return this.cart.items.reduce(
      (total, item) =>
        total + Number(item.priceAtAdd || 0) * Number(item.quantity || 0),
      0,
    );
  }

  close(): void {
    this.closeDrawer.emit();

    this._cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
