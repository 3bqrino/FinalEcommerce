import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import { IOrder } from "../../../core/models/order.model";

import { OrderService } from "../../../core/services/order.service";

import { OrderStatus } from "../order-status/order-status";

@Component({
  selector: "app-order-details",
  standalone: true,
  imports: [OrderStatus],
  templateUrl: "./order-details.html",
  styleUrl: "./order-details.css",
})
export class OrderDetails implements OnInit {
  order: IOrder | null = null;

  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.errorMessage = "Order id not found";

      this._cdr.detectChanges();

      return;
    }

    this.getOrder(id);
  }

  getOrder(id: string): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.errorMessage = "";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = err?.error?.message || "Failed to load order";

        this._cdr.detectChanges();
      },
    });
  }

  getItemsCount(): number {
    if (!this.order) {
      return 0;
    }

    return this.order.items.reduce((total, item) => total + item.quantity, 0);
  }

  getOrderNumber(): string {
    if (!this.order?._id) {
      return "------";
    }

    return this.order._id.slice(-6).toUpperCase();
  }

  getStatusLabel(): string {
    if (!this.order) {
      return "";
    }

    return this.order.status.replace("_", " ").toUpperCase();
  }

  goBack(): void {
    this.router.navigate(["/dashboard/orders"]);
  }
}
