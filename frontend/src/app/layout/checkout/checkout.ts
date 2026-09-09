import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import { IAddress } from "../../core/models/address.model";

import { AddressService } from "../../core/services/address.service";

import { OrderService } from "../../core/services/order.service";

import { ShippingService } from "../../core/services/shipping.service";

@Component({
  selector: "app-checkout",
  standalone: true,

  imports: [],

  templateUrl: "./checkout.html",
  styleUrl: "./checkout.css",
})
export class Checkout implements OnInit {
  addresses: IAddress[] = [];

  selectedAddress: IAddress | null = null;

  errorMessage = "";

  isLoading = false;

  isSubmitting = false;

  shippingFee: number | null = null;

  constructor(
    private addressService: AddressService,
    private orderService: OrderService,
    private shippingService: ShippingService,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAddresses();
    this.getShipping();
  }

  getAddresses(): void {
    this.isLoading = true;

    this.errorMessage = "";

    this._cdr.detectChanges();

    this.addressService.getAddresses().subscribe({
      next: (res: IAddress[]) => {
        this.addresses = res;

        const defaultAddress = res.find((address) => address.isDefault);

        if (defaultAddress) {
          this.selectedAddress = defaultAddress;
        } else {
          this.selectedAddress = res.length > 0 ? res[0] : null;
        }

        this.isLoading = false;

        this._cdr.detectChanges();
      },

      error: (err: any) => {
        console.error("Checkout addresses error:", err);

        this.addresses = [];

        this.selectedAddress = null;

        this.isLoading = false;

        this.errorMessage = err?.error?.message || "Failed to load addresses.";

        this._cdr.detectChanges();
      },
    });
  }

  getShipping(): void {
    this.shippingService.getShipping().subscribe({
      next: (shipping) => {
        this.shippingFee = Number(shipping?.shippingFee ?? 0);
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error("Checkout shipping error:", err);
        this.shippingFee = null;
        this._cdr.detectChanges();
      },
    });
  }

  selectAddress(address: IAddress): void {
    this.selectedAddress = address;

    this.errorMessage = "";

    this._cdr.detectChanges();
  }

  createOrder(): void {
    if (!this.selectedAddress) {
      this.errorMessage = "Please select an address.";

      this._cdr.detectChanges();

      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = "";

    this.isSubmitting = true;

    this._cdr.detectChanges();

    this.orderService.createOrder(this.selectedAddress).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        console.log(res);

        const orderId = res?.data?.order?._id;

        if (orderId) {
          this.router.navigate(["/orders", orderId]);
        } else {
          this.router.navigate(["/orders"]);
        }

        this._cdr.detectChanges();
      },

      error: (err: any) => {
        console.error("Create order error:", err);

        this.isSubmitting = false;

        this.errorMessage = err?.error?.message || "Failed to create order.";

        this._cdr.detectChanges();
      },
    });
  }

  addAddress(): void {
    this.router.navigate(["/addresses/add"]);
  }

  backToCart(): void {
    this.router.navigate(["/cart"]);
  }
}
