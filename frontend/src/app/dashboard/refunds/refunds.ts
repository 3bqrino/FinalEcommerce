import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RefundList } from "./refund-list/refund-list";

import { RefundService } from "../../core/services/refund.service";

@Component({
  selector: "app-refunds",
  standalone: true,
  imports: [RefundList],
  templateUrl: "./refunds.html",
  styleUrl: "./refunds.css",
})
export class Refunds implements OnInit {
  totalRefunds = 0;

  pendingRefunds = 0;

  rejectedRefunds = 0;

  completedRefunds = 0;

  constructor(
    private refundService: RefundService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refundService.refunds$.subscribe((refunds) => {
      this.totalRefunds = refunds.length;

      this.pendingRefunds = refunds.filter(
        (refund) => refund.status === "pending",
      ).length;

      this.rejectedRefunds = refunds.filter(
        (refund) => refund.status === "rejected",
      ).length;

      this.completedRefunds = refunds.filter(
        (refund) => refund.status === "refunded",
      ).length;

      this._cdr.detectChanges();
    });
  }
}
