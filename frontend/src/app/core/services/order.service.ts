import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable, map, tap } from "rxjs";

import { environment } from "../../../environments/environment";

import { IOrder, IShippingAddress } from "../models/order.model";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  private ordersSubject = new BehaviorSubject<IOrder[]>([]);

  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data?.orders || res?.data?.results || []),

      tap((orders) => {
        this.ordersSubject.next(orders);
      }),
    );
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res?.data?.order));
  }

  getMyOrders(): Observable<IOrder[]> {
    return this.http
      .get<any>(`${this.apiUrl}/my-orders`)
      .pipe(map((res) => res?.data?.orders || []));
  }

  createOrder(shippingAddress: IShippingAddress): Observable<any> {
    return this.http.post(this.apiUrl, {
      shippingAddress,
    });
  }

  updateOrderStatus(id: string, status: string): Observable<IOrder> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}/status`, {
        status,
      })
      .pipe(
        map((res) => res?.data?.order),

        tap((updatedOrder) => {
          if (!updatedOrder) {
            return;
          }

          const updatedOrders = this.ordersSubject.value.map((order) =>
            order._id === id ? updatedOrder : order,
          );

          this.ordersSubject.next(updatedOrders);
        }),
      );
  }
}
