import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

import { DecimalPipe } from "@angular/common";

import { RouterLink } from "@angular/router";

import { ITopProduct } from "../../../core/models/report.model";

@Component({
  selector: "app-top-products",

  standalone: true,

  imports: [DecimalPipe, RouterLink],

  templateUrl: "./top-product.html",

  styleUrl: "./top-product.css",
})
export class TopProducts implements OnChanges {
  @Input()
  products: ITopProduct[] = [];

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["products"]) {
      this._cdr.detectChanges();
    }
  }
}
