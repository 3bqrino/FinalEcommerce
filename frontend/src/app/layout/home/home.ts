import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ProductService } from "../../core/services/product.service";
import { CategoryService } from "../../core/services/category.service";

import { IProduct } from "../../core/models/product.model";
import { ICategory } from "../../core/models/category.model";
import { CommonModule } from "@angular/common";
import { Hero } from "./hero/hero";
import { Categories } from "./categories/categories";
import { NewArrival } from "./new-arrival/new-arrival";
import { Testnomial } from "./testnomial/testnomial";
import { TopSell } from "./top-sell/top-sell";
import { About } from "./about/about";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    Hero,
    Categories,
    NewArrival,
    Testnomial,
    TopSell,
    About,
    Footer,
  ],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home implements OnInit {
  categories: ICategory[] = [];

  products: IProduct[] = [];

  newArrivals: IProduct[] = [];

  topSellers: IProduct[] = [];
  errorMessage = "";

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getCategories();

    this.getProducts();
  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this._cdr.detectChanges();
      },
    });
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;

        this.newArrivals = res.filter((product) => product.isNewArrival);

        this.topSellers = res.filter((product) => product.isTopSeller);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = "Failed to load products";

        this._cdr.detectChanges();
      },
    });
  }
}
