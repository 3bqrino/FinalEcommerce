import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";

import { IStoreReport } from "../models/report.model";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getReports(): Observable<IStoreReport> {
    return this.http
      .get<{
        message: string;
        data: IStoreReport;
      }>(this.apiUrl)
      .pipe(map((response) => response.data));
  }
}
