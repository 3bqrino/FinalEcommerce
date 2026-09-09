import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ProductService } from "../../../core/services/product.service";

import { IProduct } from "../../../core/models/product.model";

@Component({
  selector: "app-low-stock",

  standalone: true,

  imports: [],

  templateUrl: "./low-stock.html",

  styleUrl: "./low-stock.css",
})
export class LowStock implements OnInit {
  products: IProduct[] = [];

  loading = false;

  errorMessage = "";

  constructor(
    private productService: ProductService,

    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getLowStockProducts();
  }

  getLowStockProducts(): void {
    this.loading = true;

    this.errorMessage = "";

    this.productService.getLowStockProducts().subscribe({
      next: (products) => {
        this.products = products;

        this.loading = false;

        this._cdr.detectChanges();
      },

      error: (error) => {
        console.error("Low stock error:", error);

        this.products = [];

        this.errorMessage =
          error?.error?.message || "Unable to load low stock products.";

        this.loading = false;

        this._cdr.detectChanges();
      },
    });
  }

  getStockStatus(stock: number): string {
    if (stock <= 0) {
      return "OUT OF STOCK";
    }

    if (stock <= 2) {
      return "CRITICAL STOCK";
    }

    return "LOW STOCK";
  }

  isCritical(stock: number): boolean {
    return stock <= 2;
  }
}
