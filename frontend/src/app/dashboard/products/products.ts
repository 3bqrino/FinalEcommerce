import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ProductList } from "./product-list/product-list";
import { ProductService } from "../../core/services/product.service";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [ProductList],
  templateUrl: "./products.html",
  styleUrl: "./products.css",
})
export class Products implements OnInit {
  totalProducts = 0;

  activeProducts = 0;

  inactiveProducts = 0;

  lowStockProducts = 0;

  outOfStockProducts = 0;

  newArrivalProducts = 0;

  topSellerProducts = 0;

  errorMessage = "";

  constructor(
    private productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.totalProducts = products.length;

      this.activeProducts = products.filter(
        (product) => product.isActive,
      ).length;

      this.inactiveProducts = products.filter(
        (product) => !product.isActive,
      ).length;

      this.lowStockProducts = products.filter(
        (product) => product.stock > 0 && product.stock <= 5,
      ).length;

      this.outOfStockProducts = products.filter(
        (product) => product.stock <= 0,
      ).length;

      this.newArrivalProducts = products.filter(
        (product) => product.isNewArrival,
      ).length;

      this.topSellerProducts = products.filter(
        (product) => product.isTopSeller,
      ).length;

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
}
