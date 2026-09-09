import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ShippingService } from "../../core/services/shipping.service";
import { IShipping } from "../../core/models/shipping.model";

@Component({
  selector: "app-shipping",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./shipping.html",
  styleUrl: "./shipping.css",
})
export class Shipping implements OnInit {
  shipping: IShipping | null = null;

  shippingFee = 0;

  errorMessage = "";
  successMessage = "";

  shippingForm = new FormGroup({
    shippingFee: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
      updateOn: "change",
    }),
  });

  constructor(
    private shippingService: ShippingService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.shippingForm.valueChanges.subscribe(() => {
      const value = this.shippingForm.getRawValue();

      this.shippingFee = value.shippingFee;
    });

    this.getShipping();
  }

  getShipping(): void {
    this.errorMessage = "";
    this.successMessage = "";

    this.shippingService.getShipping().subscribe({
      next: (shipping) => {
        this.shipping = shipping;
        this.shippingFee = shipping?.shippingFee ?? 0;
        this.shippingForm.patchValue(
          { shippingFee: this.shippingFee },
          { emitEvent: false },
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to load shipping fee";

        this._cdr.detectChanges();
      },
    });
  }

  updateShipping(): void {
    this.shippingForm.markAllAsTouched();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.shippingForm.invalid || this.shippingFee < 0) {
      this.errorMessage = "Shipping fee cannot be negative";

      this._cdr.detectChanges();

      return;
    }

    this.shippingService.updateShipping(this.shippingFee).subscribe({
      next: (shipping) => {
        this.shipping = shipping;
        this.shippingFee = shipping?.shippingFee ?? 0;

        this.successMessage = "Shipping fee updated successfully";

        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to update shipping fee";

        this._cdr.detectChanges();
      },
    });
  }
}
