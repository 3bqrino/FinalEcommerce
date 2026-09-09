import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe,
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { IOrder } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: IOrder[] = [];

  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders || [];

        this._cdr.detectChanges();
      },

      error: (err: any) => {
        this.errorMessage =
          err?.error?.message || 'Failed to load your orders.';

        this._cdr.detectChanges();
      },
    });
  }

  getStatusLabel(status: IOrder['status']): string {
    return status.replace('_', ' ').toUpperCase();
  }

  getItemsCount(order: IOrder): number {
    return order.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }
}