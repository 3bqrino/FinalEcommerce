import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { Router, RouterLink } from "@angular/router";

import { IAddress } from "../../../core/models/address.model";

import { AddressService } from "../../../core/services/address.service";

@Component({
  selector: "app-address-list",
  standalone: true,

  imports: [RouterLink],

  templateUrl: "./address-list.html",
  styleUrl: "./address-list.css",
})
export class AddressList implements OnInit {
  addresses: IAddress[] = [];

  errorMessage = "";

  isLoading = false;

  constructor(
    private addressService: AddressService,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this._cdr.detectChanges();

    this.addressService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res;

        this.isLoading = false;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Get addresses error:", err);

        this.addresses = [];

        this.isLoading = false;

        this.errorMessage = err?.error?.message || "Failed to load addresses.";

        this._cdr.detectChanges();
      },
    });
  }

  deleteAddress(id: string): void {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) {
      return;
    }

    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.getAddresses();
      },

      error: (err) => {
        console.error("Delete address error:", err);

        this.errorMessage = err?.error?.message || "Failed to delete address.";

        this._cdr.detectChanges();
      },
    });
  }

  setDefaultAddress(id: string): void {
    this.addressService.setDefaultAddress(id).subscribe({
      next: () => {
        this.getAddresses();
      },

      error: (err) => {
        console.error("Set default address error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to set default address.";

        this._cdr.detectChanges();
      },
    });
  }

  goBackToAccount(): void {
    this.router.navigate(["/account"]);
  }
}
