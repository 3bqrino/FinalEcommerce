import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

import { IProduct } from "../../core/models/product.model";
import { CartService } from "../../core/services/cart.service";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./product-card.html",
  styleUrl: "./product-card.css",
})
export class ProductCard {
  @Input() product!: IProduct;

  @Input() categoryName = "";

  @Input() categorySlug = "";

  @Input() view: "list" | "grid" = "grid";

  message = "";

  constructor(
    private cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  get imageUrl(): string {
    const image = this.product?.image || "";

    if (image.startsWith("http") || image.startsWith("/")) {
      return image;
    }

    return `http://localhost:5000/uploads/products/${image}`;
  }

  get colors(): string[] {
    const item = this.product as any;

    if (Array.isArray(item?.colors)) {
      return item.colors;
    }

    if (Array.isArray(item?.color)) {
      return item.color;
    }

    if (item?.color) {
      return [String(item.color)];
    }

    return ["#111111", "#4a5d23", "#7a2e2e", "#e8e4da"];
  }

  get sizes(): string[] {
    const item = this.product as any;

    if (Array.isArray(item?.sizes)) {
      return item.sizes.map((size: unknown) => String(size));
    }

    if (Array.isArray(item?.size)) {
      return item.size.map((size: unknown) => String(size));
    }

    if (item?.size) {
      return [String(item.size)];
    }

    return ["M", "L", "XL", "2XL"];
  }

  get sizesLabel(): string {
    return this.sizes.join(" . ");
  }

  get isSoldOut(): boolean {
    return Number(this.product?.stock) <= 0;
  }

  addToCart(): void {
    this.message = "";

    this.cartService.addToCart(this.product._id, 1, this.product).subscribe({
      next: () => {
        this.message = "Added to cart";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Add to cart error:", err);

        this.message =
          err?.error?.message || "Could not add this product to the cart";

        this._cdr.detectChanges();
      },
    });
  }

  getTheme(): string {
    switch (this.categorySlug.toLowerCase()) {
      case "men":
        return "theme-men";

      case "women":
        return "theme-women";

      default:
        return "theme-default";
    }
  }
}
