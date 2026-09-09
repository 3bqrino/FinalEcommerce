import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, RouterLink } from "@angular/router";
import { DatePipe, DecimalPipe } from "@angular/common";

import { IOrder } from "../../../core/models/order.model";
import { OrderService } from "../../../core/services/order.service";

@Component({
  selector: "app-user-order-status",
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: "./order-status.html",
  styleUrl: "./order-status.css",
})
export class UserOrderStatus implements OnInit {
  order: IOrder | null = null;
  errorMessage = "";

  readonly steps: IOrder["status"][] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  constructor(
    public route: ActivatedRoute,
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.errorMessage = "Order id not found.";
      this._cdr.detectChanges();
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id: string): void {
    this.errorMessage = "";

    this.orderService.getMyOrders().subscribe({
      next: (orders: IOrder[]) => {
        const order = orders.find((item: IOrder) => item._id === id);

        if (!order) {
          this.errorMessage = "Order not found.";
        } else {
          this.order = order;
        }

        this._cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage =
          err?.error?.message || "Failed to load order status.";
        this._cdr.detectChanges();
      },
    });
  }

  getOrderNumber(): string {
    return this.order?._id.slice(-6).toUpperCase() || "------";
  }

  getStatusLabel(status: string): string {
    return status.replace("_", " ").toUpperCase();
  }

  isStepDone(step: IOrder["status"]): boolean {
    if (!this.order) {
      return false;
    }

    if (this.order.status === "cancelled" || this.order.status === "refunded") {
      return false;
    }

    return this.steps.indexOf(step) <= this.steps.indexOf(this.order.status);
  }

  isCurrentStep(step: IOrder["status"]): boolean {
    return this.order?.status === step;
  }

  getItemsCount(): number {
    return (
      this.order?.items.reduce((total, item) => total + item.quantity, 0) || 0
    );
  }
}
