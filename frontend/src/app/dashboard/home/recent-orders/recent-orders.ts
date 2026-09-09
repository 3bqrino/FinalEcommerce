import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { OrderService } from "../../../core/services/order.service";
import { IOrder } from "../../../core/models/order.model";
import { DecimalPipe, UpperCasePipe } from "@angular/common";

@Component({
  selector: "app-recent-orders",
  standalone: true,
  imports: [RouterLink, DecimalPipe, UpperCasePipe],
  templateUrl: "./recent-orders.html",
  styleUrl: "./recent-orders.css",
})
export class RecentOrders implements OnInit {
  orders: IOrder[] = [];
  errorMessage = "";

  constructor(
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.slice(0, 5);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = "Failed to load recent orders";

        this._cdr.detectChanges();
      },
    });
  }

  getInitials(name: string): string {
    if (!name) {
      return "?";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  getOrderNumber(index: number): string {
    return String(index + 1).padStart(2, "0");
  }

  getItemLabel(count: number): string {
    return count === 1 ? "01 ITEM" : `${String(count).padStart(2, "0")} ITEMS`;
  }

  formatDate(date?: string): string {
    if (!date) {
      return "-";
    }

    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }
}
