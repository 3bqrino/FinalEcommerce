import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";

import { IOrder } from "../../../core/models/order.model";
import { OrderService } from "../../../core/services/order.service";

@Component({
  selector: "app-order-status",
  standalone: true,
  imports: [],
  templateUrl: "./order-status.html",
  styleUrl: "./order-status.css",
})
export class OrderStatus implements OnInit {
  @Input() orderId = "";

  @Input()
  currentStatus: IOrder["status"] = "pending";

  selectedStatus: IOrder["status"] = "pending";

  saving = false;

  errorMessage = "";
  successMessage = "";

  statuses: {
    value: IOrder["status"];
    label: string;
    description: string;
  }[] = [
    {
      value: "pending",
      label: "PENDING",
      description: "Order is waiting to be processed.",
    },

    {
      value: "processing",
      label: "PROCESSING",
      description: "Order is currently being prepared.",
    },

    {
      value: "confirmed",
      label: "CONFIRMED",
      description: "Order has been confirmed by the store.",
    },

    {
      value: "shipped",
      label: "SHIPPED",
      description: "Order has been dispatched to the customer.",
    },

    {
      value: "delivered",
      label: "DELIVERED",
      description: "Order has been delivered to the customer.",
    },

    {
      value: "cancelled",
      label: "CANCELLED",
      description: "Order has been cancelled.",
    },

    {
      value: "refunded",
      label: "REFUNDED",
      description: "Order payment has been refunded.",
    },
  ];

  constructor(
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.selectedStatus = this.currentStatus;
  }

  selectStatus(status: IOrder["status"]): void {
    this.selectedStatus = status;

    this.errorMessage = "";
    this.successMessage = "";

    this._cdr.detectChanges();
  }

  saveStatus(): void {
    if (
      !this.orderId ||
      this.saving ||
      this.selectedStatus === this.currentStatus
    ) {
      return;
    }

    this.errorMessage = "";
    this.successMessage = "";

    this.saving = true;

    this.orderService
      .updateOrderStatus(this.orderId, this.selectedStatus)
      .subscribe({
        next: (updatedOrder) => {
          this.currentStatus = updatedOrder.status;

          this.selectedStatus = updatedOrder.status;

          this.saving = false;

          this.successMessage = "Order status updated successfully.";

          this._cdr.detectChanges();
        },

        error: (err) => {
          this.saving = false;

          this.errorMessage =
            err?.error?.message || "Failed to update order status.";

          this._cdr.detectChanges();
        },
      });
  }

  cancel(): void {
    this.selectedStatus = this.currentStatus;

    this.errorMessage = "";
    this.successMessage = "";

    this._cdr.detectChanges();
  }

  getStatusLabel(): string {
    const current = this.statuses.find(
      (status) => status.value === this.currentStatus,
    );

    return current?.label || this.currentStatus.replace("_", " ").toUpperCase();
  }
}
