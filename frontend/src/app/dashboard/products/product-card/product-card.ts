import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import { RouterLink } from "@angular/router";

import { IProduct } from "../../../core/models/product.model";

import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./product-card.html",
  styleUrl: "./product-card.css",
})
export class ProductCard {
  @Input({
    required: true,
  })
  product!: IProduct;

  @Input()
  index = 0;

  @Output()
  activeChanged = new EventEmitter<{
    id: string;
    isActive: boolean;
  }>();

  @Output()
  newArrivalChanged = new EventEmitter<{
    id: string;
    isNewArrival: boolean;
  }>();

  @Output()
  topSellerChanged = new EventEmitter<{
    id: string;
    isTopSeller: boolean;
  }>();

  @Output()
  deleteClicked = new EventEmitter<string>();

  constructor(private _cdr: ChangeDetectorRef) {}

  getImageUrl(image?: string): string {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${environment.filesUrl}/${image}`;
  }

  toggleActive(): void {
    this.activeChanged.emit({
      id: this.product._id,
      isActive: !this.product.isActive,
    });
  }

  toggleNew(): void {
    this.newArrivalChanged.emit({
      id: this.product._id,
      isNewArrival: !this.product.isNewArrival,
    });
  }

  toggleTopSeller(): void {
    this.topSellerChanged.emit({
      id: this.product._id,
      isTopSeller: !this.product.isTopSeller,
    });
  }

  deleteProduct(): void {
    this.deleteClicked.emit(this.product._id);
  }
}
