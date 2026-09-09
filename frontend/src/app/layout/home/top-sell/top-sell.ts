import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { ProductService } from "../../../core/services/product.service";

import { IProduct } from "../../../core/models/product.model";

@Component({
  selector: "app-top-sell",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./top-sell.html",
  styleUrl: "./top-sell.css",
})
export class TopSell implements OnInit {
  products: IProduct[] = [];

  errorMessage = "";

  constructor(
    private productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products.filter((product) => product.isTopSeller);

        this.errorMessage = "";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Top sellers load error:", err);

        this.products = [];

        this.errorMessage = "Failed to load top sellers";

        this._cdr.detectChanges();
      },
    });
  }
}
