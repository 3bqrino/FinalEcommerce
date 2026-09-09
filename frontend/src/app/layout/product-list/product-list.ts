import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { ProductCard } from "../product-card/product-card";

import { IProduct } from "../../core/models/product.model";

export type ProductsView = "list" | "grid2" | "grid3" | "grid4";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [ProductCard],
  templateUrl: "./product-list.html",
  styleUrl: "./product-list.css",
})
export class ProductList {
  @Input()
  products: IProduct[] = [];

  @Input()
  categoryName = "";

  @Input()
  categorySlug = "";

  @Input()
  view: ProductsView = "grid3";

  constructor(private _cdr: ChangeDetectorRef) {}
}
