import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductService } from "../../../core/services/product.service";
import { IProduct } from "../../../core/models/product.model";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-new-arrival",
  standalone: true,
  imports: [RouterLink,DecimalPipe],
  templateUrl: "./new-arrival.html",
  styleUrl: "./new-arrival.css",
})
export class NewArrival implements OnInit {
  products: IProduct[] = [];
  errorMessage = "";

  currentSlide = 0;
  itemsPerSlide = 4;

  constructor(
    private productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  get maxSlide(): number {
    return Math.max(
      0,
      Math.ceil(this.products.length / this.itemsPerSlide) - 1,
    );
  }

  get visibleProducts(): IProduct[] {
    const start = this.currentSlide * this.itemsPerSlide;

    return this.products.slice(
      start,
      start + this.itemsPerSlide,
    );
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = (products || []).filter(
          (product) => product.isNewArrival === true,
        );

        this.currentSlide = 0;
        this.errorMessage = "";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("New arrivals load error:", err);

        this.products = [];
        this.currentSlide = 0;
        this.errorMessage = "Failed to load new arrivals";

        this._cdr.detectChanges();
      },
    });
  }

  nextSlide(): void {
    if (this.currentSlide >= this.maxSlide) {
      return;
    }

    this.currentSlide++;

    this._cdr.detectChanges();
  }

  previousSlide(): void {
    if (this.currentSlide <= 0) {
      return;
    }

    this.currentSlide--;

    this._cdr.detectChanges();
  }
}