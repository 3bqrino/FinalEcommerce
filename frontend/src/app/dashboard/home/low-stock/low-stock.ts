import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { ProductService } from "../../../core/services/product.service";
import { IProduct } from "../../../core/models/product.model";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-low-stock",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./low-stock.html",
  styleUrl: "./low-stock.css",
})
export class LowStock implements OnInit {
  products: IProduct[] = [];
  errorMessage = "";

  readonly stockLimit = 10;

  constructor(
    private productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getLowStock();
  }

  getLowStock(): void {
    this.productService.getAllProductsForAdmin().subscribe({
      next: (products) => {
        this.products = products
          .filter((product) => product.stock < this.stockLimit)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 4);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = "Failed to load stock data";

        this._cdr.detectChanges();
      },
    });
  }

  getStockStatus(stock: number): "danger" | "warning" {
    return stock <= 5 ? "danger" : "warning";
  }

  getStockLabel(stock: number): string {
    return stock <= 5 ? "CRITICAL" : "LOW";
  }

  getCategoryName(product: IProduct): string {
    if (typeof product.category === "object" && product.category) {
      return (product.category as any).name;
    }

    return "PRODUCT";
  }

  getImageUrl(image: string): string {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${environment.filesUrl}/${image}`;
  }
}
