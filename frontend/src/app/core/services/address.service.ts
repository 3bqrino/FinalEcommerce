import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";
import { IAddress } from "../models/address.model";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  private apiUrl = `${environment.apiUrl}/users/me/addresses`;

  constructor(private http: HttpClient) {}

  getAddresses(): Observable<IAddress[]> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((res) => res.data.addresses));
  }

  addAddress(address: IAddress): Observable<any> {
    return this.http.post(this.apiUrl, address);
  }

  updateAddress(id: string, address: IAddress): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, address);
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setDefaultAddress(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/default`, {});
  }
}
