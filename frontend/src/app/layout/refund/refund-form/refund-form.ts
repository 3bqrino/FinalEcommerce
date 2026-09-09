import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { Location } from "@angular/common";

import { Router } from "@angular/router";

import { RefundService } from "../../../core/services/refund.service";

import { OrderService } from "../../../core/services/order.service";

@Component({
  selector: "app-refund-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./refund-form.html",
  styleUrl: "./refund-form.css",
})
export class RefundForm implements OnInit {
  orders: any[] = [];

  selectedOrderId = "";

  reason = "";

  errorMessage = "";

  successMessage = "";

  saving = false;

  refundForm = new FormGroup({
    selectedOrderId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    reason: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)],
      updateOn: "change",
    }),
  });

  constructor(
    private orderService: OrderService,
    private refundService: RefundService,
    private router: Router,
    private location: Location,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refundForm.valueChanges.subscribe(() => {
      const value = this.refundForm.getRawValue();

      this.selectedOrderId = value.selectedOrderId;
      this.reason = value.reason;
    });

    this.getOrders();
  }

  getOrders(): void {
    this.errorMessage = "";

    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = (orders || []).filter(
          (order: any) => order.status === "delivered",
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Get orders error:", err);

        this.orders = [];

        this.errorMessage = err?.error?.message || "Failed to load orders.";

        this._cdr.detectChanges();
      },
    });
  }

  submit(): void {
    this.refundForm.markAllAsTouched();

    if (this.saving) {
      return;
    }

    this.errorMessage = "";

    this.successMessage = "";

    if (
      this.refundForm.invalid ||
      !this.selectedOrderId ||
      !this.reason.trim()
    ) {
      if (!this.selectedOrderId) {
        this.errorMessage = "Please select an order.";
      } else {
        this.errorMessage = "Please enter a refund reason.";
      }
      this._cdr.detectChanges();
      return;
    }

    if (!this.selectedOrderId) {
      this.errorMessage = "Please select an order.";

      this._cdr.detectChanges();

      return;
    }

    const trimmedReason = this.reason.trim();

    if (!trimmedReason) {
      this.errorMessage = "Please enter a refund reason.";

      this._cdr.detectChanges();

      return;
    }

    this.saving = true;

    this._cdr.detectChanges();

    this.refundService
      .createRefund(this.selectedOrderId, trimmedReason)
      .subscribe({
        next: () => {
          this.saving = false;

          this.successMessage = "Refund request submitted successfully.";

          this._cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(["/refund"]);
          }, 700);
        },

        error: (err) => {
          console.error("Create refund error:", err);

          this.saving = false;

          this.errorMessage =
            err?.error?.message || "Failed to create refund request.";

          this._cdr.detectChanges();
        },
      });
  }

  goBack(): void {
    this.location.back();
  }
}
