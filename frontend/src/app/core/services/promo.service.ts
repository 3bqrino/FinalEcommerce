import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";

import { IPromo } from "../models/promo.model";

@Injectable({
  providedIn: "root",
})
export class PromoService {
  private apiUrl = `${environment.apiUrl}/home/promo-banner`;

  constructor(private http: HttpClient) {}

  getPromo(): Observable<IPromo> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((res) => res?.data?.promoBanner));
  }

  updatePromo(data: {
    text: string;
    discount: number | null;
    link: string;
    isActive: boolean;
  }): Observable<IPromo> {
    return this.http
      .put<any>(this.apiUrl, data)
      .pipe(map((res) => res?.data?.promoBanner));
  }
}
