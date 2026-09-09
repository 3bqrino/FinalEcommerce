import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { DatePipe, Location } from "@angular/common";

import { RouterLink } from "@angular/router";

import { IRefund } from "../../../core/models/refund.model";

import { RefundService } from "../../../core/services/refund.service";

@Component({
  selector: "app-refund-list",
  standalone: true,

  imports: [DatePipe, RouterLink],

  templateUrl: "./refund-list.html",
  styleUrl: "./refund-list.css",
})
export class RefundList implements OnInit {
  refunds: IRefund[] = [];

  errorMessage = "";

  constructor(
    private refundService: RefundService,
    private location: Location,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getRefunds();
  }

  getRefunds(): void {
    this.errorMessage = "";

    this.refundService.getMyRefunds().subscribe({
      next: (refunds) => {
        this.refunds = refunds || [];

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Get refunds error:", err);

        this.errorMessage = err?.error?.message || "Failed to load refunds.";

        this._cdr.detectChanges();
      },
    });
  }

  getOrderNumber(refund: IRefund): string {
    if (!refund.order) {
      return "------";
    }

    if (typeof refund.order === "string") {
      return refund.order.slice(-6).toUpperCase();
    }

    return refund.order._id.slice(-6).toUpperCase();
  }

  getStatusLabel(status: IRefund["status"]): string {
    return status.toUpperCase();
  }

  goBack(): void {
    this.location.back();
  }
}
