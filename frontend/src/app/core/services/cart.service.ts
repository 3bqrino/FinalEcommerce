import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, map, tap, throwError } from "rxjs";

import { environment } from "../../../environments/environment";
import { IProduct } from "../models/product.model";
import { ICart } from "../models/cart.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private readonly storageKey = "cart";

  private cartSubject = new BehaviorSubject<ICart>(this.readGuestCart());

  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  private isAuthenticated(): boolean {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
  }

  private emptyGuestCart(): ICart {
    return {
      _id: "guest-cart",
      user: "guest",
      items: [],
    };
  }

  private readGuestCart(): ICart {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return this.emptyGuestCart();

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) {
        return this.emptyGuestCart();
      }
      return {
        ...this.emptyGuestCart(),
        ...parsed,
        items: parsed.items,
      };
    } catch {
      localStorage.removeItem(this.storageKey);
      return this.emptyGuestCart();
    }
  }

  private saveGuestCart(cart: ICart): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  loadGuestCart(): ICart {
    const cart = this.readGuestCart();
    this.cartSubject.next(cart);
    return cart;
  }

  getCurrentCart(): ICart {
    return this.cartSubject.value;
  }

  hasItems(): boolean {
    return this.cartSubject.value.items.length > 0;
  }

  getCart(): Observable<ICart> {
    if (!this.isAuthenticated()) {
      return of(this.loadGuestCart());
    }

    return this.http.get<any>(this.apiUrl).pipe(
      map(
        (res) =>
          res?.data?.cart || {
            _id: "server-cart",
            items: [],
          },
      ),
      tap((cart) => this.cartSubject.next(cart)),
    );
  }

  addToCart(
    productId: string,
    quantity: number,
    product?: IProduct,
  ): Observable<ICart> {
    if (!this.isAuthenticated()) {
      if (!product) {
        return throwError(
          () => new Error("Product data is required for guest cart"),
        );
      }

      const cart = this.readGuestCart();
      const existing = cart.items.find(
        (item) => item.product._id === productId,
      );

      const requestedQuantity = Number(quantity);
      const finalQuantity = (existing?.quantity || 0) + requestedQuantity;

      if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        return throwError(() => new Error("Quantity must be at least 1"));
      }

      if (finalQuantity > Number(product.stock || 0)) {
        return throwError(() => new Error("Not enough stock"));
      }

      const cartProduct = {
        _id: product._id,
        name: product.name,
        price: Number(product.price || 0),
        image: product.image,
        stock: Number(product.stock || 0),
        slug: product.slug,
      };

      if (existing) {
        existing.quantity = finalQuantity;
        existing.priceAtAdd = cartProduct.price;
        existing.priceChanged = false;
      } else {
        cart.items.push({
          product: cartProduct,
          quantity: requestedQuantity,
          priceAtAdd: cartProduct.price,
          priceChanged: false,
        });
      }

      this.saveGuestCart(cart);
      return of(cart);
    }

    return this.http.post<any>(this.apiUrl, { productId, quantity }).pipe(
      map((res) => res.data.cart),
      tap((cart) => this.cartSubject.next(cart)),
    );
  }

  updateCartItem(productId: string, quantity: number): Observable<ICart> {
    if (!this.isAuthenticated()) {
      const cart = this.readGuestCart();
      const item = cart.items.find(
        (current) => current.product._id === productId,
      );

      if (!item) {
        return throwError(() => new Error("Product not found in cart"));
      }

      const nextQuantity = Number(quantity);
      if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
        return throwError(() => new Error("Quantity must be at least 1"));
      }

      if (nextQuantity > item.product.stock) {
        return throwError(() => new Error("Not enough stock"));
      }

      item.quantity = nextQuantity;
      item.priceAtAdd = item.product.price;
      item.priceChanged = false;

      this.saveGuestCart(cart);
      return of(cart);
    }

    return this.http.put<any>(this.apiUrl, { productId, quantity }).pipe(
      map((res) => res.data.cart),
      tap((cart) => this.cartSubject.next(cart)),
    );
  }

  acceptPriceChange(): Observable<ICart> {
    if (!this.isAuthenticated()) {
      const cart = this.readGuestCart();

      for (const item of cart.items) {
        item.priceAtAdd = item.product.price;
        item.priceChanged = false;
      }

      this.saveGuestCart(cart);
      return of(cart);
    }

    return this.http.put<any>(`${this.apiUrl}/price-change/accept`, {}).pipe(
      map((res) => res.data.cart),
      tap((cart) => this.cartSubject.next(cart)),
    );
  }

  removeFromCart(productId: string): Observable<ICart> {
    if (!this.isAuthenticated()) {
      const cart = this.readGuestCart();
      const nextItems = cart.items.filter(
        (item) => item.product._id !== productId,
      );

      if (nextItems.length === cart.items.length) {
        return throwError(() => new Error("Product not found in cart"));
      }

      cart.items = nextItems;
      this.saveGuestCart(cart);
      return of(cart);
    }

    return this.http.delete<any>(`${this.apiUrl}/${productId}`).pipe(
      map((res) => res.data.cart),
      tap((cart) => this.cartSubject.next(cart)),
    );
  }

  clearCart(): Observable<ICart> {
    if (!this.isAuthenticated()) {
      const cart = this.emptyGuestCart();
      this.saveGuestCart(cart);
      return of(cart);
    }

    return this.http.delete<any>(`${this.apiUrl}/clear`).pipe(
      map((res) => res.data.cart),
      tap((cart) => this.cartSubject.next(cart)),
    );
  }

  mergeGuestCart(): Observable<ICart> {
    if (!this.isAuthenticated()) {
      return of(this.loadGuestCart());
    }

    const guestCart = this.readGuestCart();
    const items = guestCart.items.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    if (items.length === 0) {
      return this.getCart();
    }

    return this.http.post<any>(`${this.apiUrl}/merge`, { items }).pipe(
      map((res) => res?.data?.cart),
      tap((cart) => {
        localStorage.removeItem(this.storageKey);
        this.cartSubject.next(
          cart || {
            _id: "server-cart",
            items: [],
          },
        );
      }),
    );
  }
}
