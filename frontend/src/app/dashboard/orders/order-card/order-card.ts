import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { RouterLink } from "@angular/router";

import { IOrder } from "../../../core/models/order.model";

@Component({
  selector: "app-order-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./order-card.html",
  styleUrl: "./order-card.css",
})
export class OrderCard {
  @Input() order!: IOrder;

  @Input() index = 1;

  constructor(private _cdr: ChangeDetectorRef) {}

  getOrderNumber(): string {
    if (!this.order?._id) {
      return "------";
    }

    return this.order._id.slice(-6).toUpperCase();
  }

  getCustomerName(): string {
    return this.order?.user?.name || "Unknown customer";
  }

  getCustomerEmail(): string {
    return this.order?.user?.email || "No email";
  }

  getInitial(): string {
    return this.getCustomerName().charAt(0).toUpperCase();
  }

  getItemsCount(): number {
    return (
      this.order?.items?.reduce((total, item) => total + item.quantity, 0) || 0
    );
  }

  getOrderDate(): string {
    if (!this.order?.createdAt) {
      return "—";
    }

    return new Date(this.order.createdAt)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }

  getProgress(): number {
    switch (this.order.status) {
      case "pending":
        return 20;

      case "processing":
        return 40;

      case "confirmed":
        return 60;

      case "shipped":
        return 80;

      case "delivered":
        return 100;

      case "cancelled":
        return 0;

      case "refunded":
        return 0;

      default:
        return 0;
    }
  }

  getProgressStep(): string {
    switch (this.order.status) {
      case "pending":
        return "1 / 5";

      case "processing":
        return "2 / 5";

      case "confirmed":
        return "3 / 5";

      case "shipped":
        return "4 / 5";

      case "delivered":
        return "5 / 5";

      case "cancelled":
        return "—";

      case "refunded":
        return "—";

      default:
        return "—";
    }
  }

  getStatusLabel(): string {
    if (!this.order?.status) {
      return "UNKNOWN";
    }

    return this.order.status.replace("_", " ").toUpperCase();
  }
}
