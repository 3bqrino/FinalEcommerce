import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { DecimalPipe } from "@angular/common";

import { ReportService } from "../../core/services/report.service";

import { IStoreReport } from "../../core/models/report.model";

import { TopProducts } from "./top-product/top-product";

import { TopUser } from "./top-user/top-user";

import { Chart } from "./chart/chart";

import { LowStock } from "./low-stock/low-stock";

@Component({
  selector: "app-reports",

  standalone: true,

  imports: [DecimalPipe, Chart, TopProducts, TopUser, LowStock],

  templateUrl: "./reports.html",

  styleUrl: "./reports.css",
})
export class Reports implements OnInit {
  report: IStoreReport | null = null;

  errorMessage = "";

  loading = false;

  constructor(
    private reportService: ReportService,

    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {
    this.loading = true;

    this.errorMessage = "";

    this.reportService.getReports().subscribe({
      next: (response) => {
        this.report = response || null;

        this.loading = false;

        this._cdr.detectChanges();
      },

      error: (error) => {
        console.error("Reports error:", error);

        this.errorMessage =
          error?.error?.message || "Unable to load store reports.";

        this.loading = false;

        this._cdr.detectChanges();
      },
    });
  }
}
