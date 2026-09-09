import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, RouterLink } from "@angular/router";

import { IProduct, IProductRef } from "../../../core/models/product.model";

import { ProductService } from "../../../core/services/product.service";

import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-product-details",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./product-details.html",
  styleUrl: "./product-details.css",
})
export class ProductDetails implements OnInit {
  product: IProduct | null = null;

  errorMessage = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.errorMessage = "Product not found.";

      this._cdr.detectChanges();

      return;
    }

    this.getProduct(id);
  }

  getProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;

        this.errorMessage = "";

        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to load product.";

        this._cdr.detectChanges();
      },
    });
  }

  getImageUrl(image: string | undefined): string {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${environment.filesUrl}/${image}`;
  }

  getRefName(value: string | IProductRef | null | undefined): string {
    if (!value) {
      return "—";
    }

    if (typeof value === "string") {
      return value;
    }

    return value.name || "—";
  }

  getCategoryName(): string {
    return this.getRefName(this.product?.category);
  }

  getSubcategoryName(): string {
    return this.getRefName(this.product?.subCategory);
  }
}
