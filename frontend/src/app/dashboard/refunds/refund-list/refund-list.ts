import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RefundService } from "../../../core/services/refund.service";
import { IRefund } from "../../../core/models/refund.model";

import { RefundCard } from "../refund-card/refund-card";

@Component({
  selector: "app-refund-list",
  standalone: true,
  imports: [RefundCard],
  templateUrl: "./refund-list.html",
  styleUrl: "./refund-list.css",
})
export class RefundList implements OnInit {
  refunds: IRefund[] = [];

  errorMessage = "";

  constructor(
    private refundService: RefundService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refundService.refunds$.subscribe((refunds) => {
      this.refunds = refunds;

      this._cdr.detectChanges();
    });

    this.getRefunds();
  }

  getRefunds(): void {
    this.errorMessage = "";

    this.refundService.getAllRefunds().subscribe({
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to load refunds.";

        this._cdr.detectChanges();
      },
    });
  }
}
