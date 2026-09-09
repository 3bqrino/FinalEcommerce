import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";
import { IShipping } from "../models/shipping.model";

@Injectable({
  providedIn: "root",
})
export class ShippingService {
  private apiUrl = `${environment.apiUrl}/shipping`;

  constructor(private http: HttpClient) {}

  getShipping(): Observable<IShipping> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((res) => res?.data?.shipping));
  }

  updateShipping(shippingFee: number): Observable<IShipping> {
    return this.http
      .put<any>(this.apiUrl, {
        shippingFee,
      })
      .pipe(map((res) => res?.data?.shipping));
  }
}
