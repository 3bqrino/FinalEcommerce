import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { OrderList } from "./order-list/order-list";
import { OrderService } from "../../core/services/order.service";

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [OrderList],
  templateUrl: "./orders.html",
  styleUrl: "./orders.css",
})
export class Orders implements OnInit {
  totalOrders = 0;

  pendingOrders = 0;

  processingOrders = 0;

  shippedOrders = 0;

  deliveredOrders = 0;

  cancelledOrders = 0;

  refundedOrders = 0;

  errorMessage = "";

  constructor(
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.orderService.orders$.subscribe((orders) => {
      this.totalOrders = orders.length;

      this.pendingOrders = orders.filter(
        (order) => order.status === "pending",
      ).length;

      this.processingOrders = orders.filter(
        (order) => order.status === "processing",
      ).length;

      this.shippedOrders = orders.filter(
        (order) => order.status === "shipped",
      ).length;

      this.deliveredOrders = orders.filter(
        (order) => order.status === "delivered",
      ).length;

      this.cancelledOrders = orders.filter(
        (order) => order.status === "cancelled",
      ).length;

      this.refundedOrders = orders.filter(
        (order) => order.status === "refunded",
      ).length;

      this._cdr.detectChanges();
    });

    this.getOrders();
  }

  getOrders(): void {
    this.errorMessage = "";

    this.orderService.getAllOrders().subscribe({
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to load orders.";

        this._cdr.detectChanges();
      },
    });
  }
}
