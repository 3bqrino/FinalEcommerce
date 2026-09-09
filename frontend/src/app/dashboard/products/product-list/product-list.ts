import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { IProduct } from "../../../core/models/product.model";

import { ProductService } from "../../../core/services/product.service";

import { ProductCard } from "../product-card/product-card";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: "./product-list.html",
  styleUrl: "./product-list.css",
})
export class ProductList implements OnInit {
  products: IProduct[] = [];

  errorMessage = "";

  constructor(
    private productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.products = products;

      this._cdr.detectChanges();
    });

    this.getProducts();
  }

  getProducts(): void {
    this.errorMessage = "";

    this.productService.getAllProductsForAdmin().subscribe({
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to load products.";

        this._cdr.detectChanges();
      },
    });
  }

  toggleActive(event: { id: string; isActive: boolean }): void {
    const formData = new FormData();

    formData.append("isActive", String(event.isActive));

    this.productService.updateProduct(event.id, formData).subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to update product status.";

        this._cdr.detectChanges();
      },
    });
  }

  toggleNewArrival(event: { id: string; isNewArrival: boolean }): void {
    const formData = new FormData();

    formData.append("isNewArrival", String(event.isNewArrival));

    this.productService.updateProduct(event.id, formData).subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to update new arrival.";

        this._cdr.detectChanges();
      },
    });
  }

  toggleTopSeller(event: { id: string; isTopSeller: boolean }): void {
    const formData = new FormData();

    formData.append("isTopSeller", String(event.isTopSeller));

    this.productService.updateProduct(event.id, formData).subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to update top seller.";

        this._cdr.detectChanges();
      },
    });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to delete product.";

        this._cdr.detectChanges();
      },
    });
  }
}
