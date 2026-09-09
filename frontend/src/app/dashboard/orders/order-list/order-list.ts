import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { IOrder } from "../../../core/models/order.model";
import { OrderService } from "../../../core/services/order.service";

import { OrderCard } from "../order-card/order-card";

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [OrderCard],
  templateUrl: "./order-list.html",
  styleUrl: "./order-list.css",
})
export class OrderList implements OnInit {
  orders: IOrder[] = [];

  errorMessage = "";

  constructor(
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.orderService.orders$.subscribe((orders) => {
      this.orders = orders;

      this._cdr.detectChanges();
    });

    this.getOrders();
  }

  getOrders(): void {
    this.errorMessage = "";

    this.orderService.getAllOrders().subscribe({
      error: (err) => {
        console.log(err);

        this.errorMessage = err?.error?.message || "Failed to load orders";

        this._cdr.detectChanges();
      },
    });
  }

  getCustomerName(order: IOrder): string {
    return order.user?.name || "Unknown customer";
  }
}
