import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import { IProduct } from "../../../core/models/product.model";

import { QuantitySelector } from "../quantity-selector/quantity-selector";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-sticky-cart",
  standalone: true,
  imports: [QuantitySelector,DecimalPipe],
  templateUrl: "./sticky-cart.html",
  styleUrl: "./sticky-cart.css",
})
export class StickyCart {
  @Input() product: IProduct | null = null;

  @Input() quantity = 1;

  @Input() selectedColor = "";

  @Input() selectedSize = "";

  @Output() quantityChange = new EventEmitter<number>();

  @Output() addToCartRequest = new EventEmitter<void>();

  constructor(private _cdr: ChangeDetectorRef) {}

  onQuantityChange(value: number): void {
    this.quantity = value;

    this.quantityChange.emit(value);

    this._cdr.detectChanges();
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    if (this.getStock() <= 0) {
      return;
    }

    this.addToCartRequest.emit();

    this._cdr.detectChanges();
  }

  getStock(): number {
    return Number(this.product?.stock || 0);
  }

  getSubCategoryName(): string {
    if (!this.product?.subCategory) {
      return "";
    }

    if (typeof this.product.subCategory === "string") {
      return this.product.subCategory;
    }

    return this.product.subCategory.name || "";
  }

  getPriceLabel(): string {
    const price = Number(this.product?.price || 0);

    return `LE ${price.toFixed(2)}`;
  }

  getVariantLabel(): string {
    const parts: string[] = [];

    if (this.selectedColor) {
      parts.push(this.selectedColor);
    }

    if (this.selectedSize) {
      parts.push(this.selectedSize);
    }

    const variantText =
      parts.length > 0 ? parts.join(" / ") : this.getSubCategoryName();

    if (variantText) {
      return `${variantText} - ${this.getPriceLabel()}`;
    }

    return this.getPriceLabel();
  }
}
