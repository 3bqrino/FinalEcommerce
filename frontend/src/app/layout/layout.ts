import { ChangeDetectorRef, Component } from "@angular/core";

import { RouterOutlet } from "@angular/router";

import { CartDrawer } from "./shared/cart-drawer/cart-drawer";

import { Navbar } from "./shared/nav-bar/nav-bar";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, CartDrawer, Navbar],
  templateUrl: "./layout.html",
  styleUrl: "./layout.css",
})
export class Layout {
  cartOpen = false;

  constructor(private _cdr: ChangeDetectorRef) {}

  openCart(): void {
    this.cartOpen = true;

    this._cdr.detectChanges();
  }

  closeCart(): void {
    this.cartOpen = false;

    this._cdr.detectChanges();
  }
}
