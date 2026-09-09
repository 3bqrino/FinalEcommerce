import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import { IRefund } from "../../../core/models/refund.model";

import { RefundService } from "../../../core/services/refund.service";

@Component({
  selector: "app-refund-details",
  standalone: true,

  templateUrl: "./refund-details.html",
  styleUrl: "./refund-details.css",
})
export class RefundDetails implements OnInit {
  refund: IRefund | null = null;

  refundId = "";

  adminNote = "";

  errorMessage = "";

  successMessage = "";

  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private refundService: RefundService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refundId = this.route.snapshot.paramMap.get("id") || "";

    if (!this.refundId) {
      this.errorMessage = "Refund id not found.";

      this._cdr.detectChanges();

      return;
    }

    this.getRefund(this.refundId);
  }

  getRefund(id: string): void {
    this.errorMessage = "";

    this.successMessage = "";

    this.refundService.getRefundById(id).subscribe({
      next: (refund) => {
        this.refund = refund;

        this.adminNote = refund.adminNote || "";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Failed to load refund:", err);

        this.errorMessage = err?.error?.message || "Failed to load refund.";

        this._cdr.detectChanges();
      },
    });
  }

  approve(): void {
    if (!this.refund || this.saving || this.refund.status !== "pending") {
      return;
    }

    this.clearMessages();

    this.saving = true;

    this.refundService
      .approveRefund(this.refund._id, this.adminNote)
      .subscribe({
        next: (refund) => {
          this.refund = refund;

          this.adminNote = refund.adminNote || "";

          this.saving = false;

          this.successMessage = "Refund approved and completed successfully.";

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.error("Failed to approve refund:", err);

          this.saving = false;

          this.errorMessage =
            err?.error?.message || "Failed to approve refund.";

          this._cdr.detectChanges();
        },
      });
  }

  reject(): void {
    if (!this.refund || this.saving || this.refund.status !== "pending") {
      return;
    }

    this.clearMessages();

    this.saving = true;

    this.refundService.rejectRefund(this.refund._id, this.adminNote).subscribe({
      next: (refund) => {
        this.refund = refund;

        this.adminNote = refund.adminNote || "";

        this.saving = false;

        this.successMessage = "Refund rejected successfully.";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Failed to reject refund:", err);

        this.saving = false;

        this.errorMessage = err?.error?.message || "Failed to reject refund.";

        this._cdr.detectChanges();
      },
    });
  }

  getOrderNumber(): string {
    if (!this.refund?.order) {
      return "------";
    }

    if (typeof this.refund.order === "string") {
      return this.refund.order.slice(-6).toUpperCase();
    }

    return this.refund.order._id.slice(-6).toUpperCase();
  }

  getCustomerName(): string {
    if (!this.refund?.user || typeof this.refund.user === "string") {
      return "Customer";
    }

    return this.refund.user.name || "Customer";
  }

  getCustomerEmail(): string {
    if (!this.refund?.user || typeof this.refund.user === "string") {
      return "";
    }

    return this.refund.user.email || "";
  }

  getStatusLabel(): string {
    return this.refund?.status?.toUpperCase() || "UNKNOWN";
  }

  clearMessages(): void {
    this.errorMessage = "";

    this.successMessage = "";
  }

  goBack(): void {
    this.router.navigate(["/dashboard/refunds"]);
  }
}
