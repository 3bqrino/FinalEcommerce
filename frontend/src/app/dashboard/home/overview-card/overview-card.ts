import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ReportService } from "../../../core/services/report.service";
import { IStoreReport } from "../../../core/models/report.model";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-overview-card",
  standalone: true,
  templateUrl: "./overview-card.html",
  styleUrl: "./overview-card.css",
  imports: [DecimalPipe],
})
export class OverviewCard implements OnInit {
  report: IStoreReport | null = null;
  constructor(
    private reportService: ReportService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): void {
    this.reportService.getReports().subscribe({
      next: (res) => {
        this.report = res;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this._cdr.detectChanges();
      },
    });
  }
}
