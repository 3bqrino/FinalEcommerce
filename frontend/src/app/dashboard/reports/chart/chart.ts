import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

import { CommonModule, DecimalPipe } from "@angular/common";

import { IStoreReport, ISalesMonth } from "../../../core/models/report.model";

@Component({
  selector: "app-chart",
  standalone: true,

  imports: [CommonModule, DecimalPipe],

  templateUrl: "./chart.html",

  styleUrl: "./chart.css",
})
export class Chart implements OnChanges {
  @Input()
  report: IStoreReport | null = null;

  selectedPeriod: 6 | 12 = 6;

  chartData: ISalesMonth[] = [];

  maxRevenue = 0;

  totalRevenue = 0;

  totalOrders = 0;

  totalItemsSold = 0;

  growth = 0;

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["report"]) {
      this.updateChart();
    }
  }

  selectPeriod(period: 6 | 12): void {
    this.selectedPeriod = period;

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.report) {
      this.chartData = [];
      return;
    }

    this.chartData =
      this.selectedPeriod === 6
        ? this.report.salesByMonth6 || []
        : this.report.salesByMonth12 || [];

    this.maxRevenue = Math.max(
      ...this.chartData.map((item) => Number(item.revenue || 0)),
      0,
    );

    this.totalRevenue = this.chartData.reduce(
      (sum, item) => sum + Number(item.revenue || 0),
      0,
    );

    this.totalOrders = this.chartData.reduce(
      (sum, item) => sum + Number(item.orders || 0),
      0,
    );

    this.totalItemsSold = this.chartData.reduce(
      (sum, item) => sum + Number(item.itemsSold || 0),
      0,
    );

    this.growth = this.calculateGrowth();

    this._cdr.detectChanges();
  }

  private calculateGrowth(): number {
    if (this.chartData.length < 2) {
      return 0;
    }

    const current = Number(
      this.chartData[this.chartData.length - 1]?.revenue || 0,
    );

    const previous = Number(
      this.chartData[this.chartData.length - 2]?.revenue || 0,
    );

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return ((current - previous) / previous) * 100;
  }

  getPointPosition(revenue: number): number {
    if (this.maxRevenue <= 0) {
      return 90;
    }

    return 90 - (revenue / this.maxRevenue) * 75;
  }

  getLinePoints(): string {
    if (!this.chartData.length) {
      return "";
    }

    const width = 100;

    const height = 100;

    const count = this.chartData.length;

    return this.chartData
      .map((item, index) => {
        const x = count === 1 ? 50 : (index / (count - 1)) * width;

        const y = this.getPointPosition(Number(item.revenue || 0));

        return `${x},${y}`;
      })
      .join(" ");
  }

  getAreaPoints(): string {
    if (!this.chartData.length) {
      return "";
    }

    const linePoints = this.getLinePoints();

    return `
      0,100
      ${linePoints}
      100,100
    `;
  }

  formatRevenue(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }

    if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }

    return value.toFixed(0);
  }
}
