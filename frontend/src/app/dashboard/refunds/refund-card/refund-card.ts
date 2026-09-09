import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { RouterLink } from "@angular/router";

import { IRefund } from "../../../core/models/refund.model";

@Component({
  selector: "app-refund-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./refund-card.html",
  styleUrl: "./refund-card.css",
})
export class RefundCard {
  @Input() refund!: IRefund;

  constructor(private _cdr: ChangeDetectorRef) {}

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
    if (!this.refund?.user) {
      return "Unknown customer";
    }

    if (typeof this.refund.user === "string") {
      return "Customer";
    }

    return this.refund.user.name || "Unknown customer";
  }

  getCustomerEmail(): string {
    if (!this.refund?.user || typeof this.refund.user === "string") {
      return "";
    }

    return this.refund.user.email || "";
  }

  getInitial(): string {
    return this.getCustomerName().charAt(0).toUpperCase();
  }

  getStatusClass(): string {
    return this.refund?.status || "pending";
  }

  getStatusLabel(): string {
    return this.refund?.status?.toUpperCase() || "UNKNOWN";
  }

  getDate(): string {
    if (!this.refund?.createdAt) {
      return "—";
    }

    return new Date(this.refund.createdAt)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }
}
