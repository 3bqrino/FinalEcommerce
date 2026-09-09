import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router, RouterLink } from "@angular/router";

import { ProductService } from "../../core/services/product.service";
import { CartService } from "../../core/services/cart.service";
import { ProductCard } from "../product-card/product-card";
import { QuantitySelector } from "../shared/quantity-selector/quantity-selector";
import { StickyCart } from "../shared/sticky-cart/sticky-cart";
import { IProduct } from "../../core/models/product.model";

@Component({
  selector: "app-product-details",
  standalone: true,
  imports: [RouterLink, ProductCard, QuantitySelector, StickyCart],
  templateUrl: "./product-details.html",
  styleUrl: "./product-details.css",
})
export class ProductDetails implements OnInit {
  product: IProduct | null = null;

  relatedProducts: IProduct[] = [];

  productSlug = "";

  categorySlug = "";

  errorMessage = "";
  cartMessage = "";

  quantity = 1;

  isDescriptionOpen = true;
  isAdditionalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = (params.get("slug") || "").trim().toLowerCase();

      this.productSlug = slug;

      if (!this.productSlug) {
        this.product = null;
        this.relatedProducts = [];
        this.categorySlug = "";
        this.errorMessage = "Product not found";

        this._cdr.detectChanges();

        return;
      }

      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.productService.getProductBySlug(this.productSlug).subscribe({
      next: (product) => {
        this.product = product;

        this.quantity = 1;

        this.errorMessage = "";

        this.cartMessage = "";

        this.categorySlug = this.resolveCategorySlug(product);

        console.log("Product:", product);

        console.log("Category:", product?.category);

        console.log("Category slug:", this.categorySlug);

        this.loadRelatedProducts();

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Product details error:", err);

        this.product = null;

        this.relatedProducts = [];

        this.categorySlug = "";

        this.errorMessage = err?.error?.message || "Failed to load product";

        this._cdr.detectChanges();
      },
    });
  }

  private resolveCategorySlug(product: IProduct): string {
    const category = product?.category;

    if (!category) {
      return "";
    }

    if (typeof category === "object") {
      const slug = (category as any).slug;

      if (typeof slug === "string" && slug.trim()) {
        return slug.trim().toLowerCase();
      }

      const name = (category as any).name;

      if (typeof name === "string" && name.trim()) {
        return this.createSlug(name);
      }

      return "";
    }

    const categoryValue = String(category).trim();

    if (!categoryValue) {
      return "";
    }

    return this.createSlug(categoryValue);
  }

  loadRelatedProducts(): void {
    if (!this.product?.slug) {
      this.relatedProducts = [];

      this._cdr.detectChanges();

      return;
    }

    this.productService.getRelatedProducts(this.product.slug).subscribe({
      next: (products) => {
        this.relatedProducts = products.filter(
          (item) => item._id !== this.product?._id,
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Related products error:", err);

        this.relatedProducts = [];

        this._cdr.detectChanges();
      },
    });
  }

  goToCollection(): void {
    const slug = this.getCategorySlug();

    console.log("VIEW COLLECTION CLICKED");

    console.log("Category slug:", slug);

    if (!slug) {
      console.error("Category slug is empty.");

      return;
    }

    this.router.navigate(["/category", slug]).then(
      (success) => {
        console.log("Category navigation:", success);

        this._cdr.detectChanges();
      },
      (error) => {
        console.error("Category navigation error:", error);

        this._cdr.detectChanges();
      },
    );
  }

  onQuantityChange(value: number): void {
    this.quantity = value;

    this._cdr.detectChanges();
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    if (!this.isInStock()) {
      this.cartMessage = "This product is currently out of stock.";

      this._cdr.detectChanges();
      return;
    }

    const stock = this.getStock();

    if (this.quantity > stock) {
      this.quantity = stock;
    }

    if (this.quantity <= 0) {
      this.cartMessage = "Please select a valid quantity.";

      this._cdr.detectChanges();
      return;
    }

    this.cartMessage = "";

    this.cartService
      .addToCart(this.product._id, this.quantity, this.product)
      .subscribe({
        next: () => {
          this.cartMessage = "Added to cart successfully.";

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.error("Add to cart error:", err);

          this.cartMessage =
            err?.error?.message || "Could not add this product to the cart.";

          this._cdr.detectChanges();
        },
      });
  }

  buyNow(): void {
    if (!this.product) {
      return;
    }

    if (!this.isInStock()) {
      this.cartMessage = "This product is currently out of stock.";

      this._cdr.detectChanges();

      return;
    }

    const stock = this.getStock();

    if (this.quantity > stock) {
      this.quantity = stock;
    }

    this._cdr.detectChanges();
  }

  toggleDescription(): void {
    this.isDescriptionOpen = !this.isDescriptionOpen;

    this._cdr.detectChanges();
  }

  toggleAdditional(): void {
    this.isAdditionalOpen = !this.isAdditionalOpen;

    this._cdr.detectChanges();
  }

  getCategoryName(): string {
    if (!this.product?.category) {
      return "NATURAL";
    }

    if (typeof this.product.category === "string") {
      return this.product.category;
    }

    return this.product.category.name || "NATURAL";
  }

  getCategorySlug(): string {
    return this.categorySlug;
  }

  getSubCategoryName(): string {
    if (!this.product?.subCategory) {
      return "";
    }

    if (typeof this.product.subCategory === "string") {
      return this.product.subCategory;
    }

    return this.product.subCategory.name || "";
  }

  getStock(): number {
    return Number(this.product?.stock || 0);
  }

  isInStock(): boolean {
    return this.getStock() > 0;
  }

  private createSlug(value: string): string {
    return value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
