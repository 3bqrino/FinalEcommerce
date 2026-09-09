import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable, map, tap } from "rxjs";

import { environment } from "../../../environments/environment";

import { IFooter } from "../models/footer.model";

@Injectable({
  providedIn: "root",
})
export class FooterService {
  private apiUrl = `${environment.apiUrl}/home/footer`;

  constructor(private http: HttpClient) {}

  getFooter(): Observable<IFooter> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        return res?.data?.footer;
      }),
    );
  }

  updateFooter(data: IFooter): Observable<IFooter> {
    return this.http.put<any>(this.apiUrl, data).pipe(
      map((res) => {
        return res?.data?.footer;
      }),
    );
  }
}
