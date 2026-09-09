import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable, map, tap } from "rxjs";

import { environment } from "../../../environments/environment";

import { IRefund } from "../models/refund.model";

@Injectable({
  providedIn: "root",
})
export class RefundService {
  private apiUrl = `${environment.apiUrl}/refunds`;

  private refundsSubject = new BehaviorSubject<IRefund[]>([]);

  refunds$ = this.refundsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllRefunds(): Observable<IRefund[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data?.refunds || []),

      tap((refunds) => {
        this.refundsSubject.next(refunds);
      }),
    );
  }

  getRefundById(id: string): Observable<IRefund> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res?.data?.refund));
  }

  getMyRefunds(): Observable<IRefund[]> {
    return this.http
      .get<any>(`${this.apiUrl}/my`)
      .pipe(map((res) => res?.data?.refunds || []));
  }

  createRefund(orderId: string, reason: string): Observable<IRefund> {
    return this.http
      .post<any>(this.apiUrl, {
        orderId,
        reason,
      })
      .pipe(map((res) => res?.data?.refund));
  }

  approveRefund(id: string, adminNote = ""): Observable<IRefund> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}/approve`, {
        adminNote,
      })
      .pipe(
        map((res) => res?.data?.refund),

        tap((refund) => {
          this.updateRefundInState(refund);
        }),
      );
  }

  rejectRefund(id: string, adminNote = ""): Observable<IRefund> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}/reject`, {
        adminNote,
      })
      .pipe(
        map((res) => res?.data?.refund),

        tap((refund) => {
          this.updateRefundInState(refund);
        }),
      );
  }

  private updateRefundInState(updatedRefund: IRefund): void {
    if (!updatedRefund) {
      return;
    }

    const refunds = this.refundsSubject.value.map((refund) =>
      refund._id === updatedRefund._id ? updatedRefund : refund,
    );

    this.refundsSubject.next(refunds);
  }
}
