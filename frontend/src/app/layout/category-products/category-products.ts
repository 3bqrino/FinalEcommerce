import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { combineLatest } from "rxjs";

import { ProductService } from "../../core/services/product.service";
import { CategoryService } from "../../core/services/category.service";
import { SubcategoryService } from "../../core/services/subcategory.service";

import {
  ProductList,
  ProductsView,
} from "../product-list/product-list";

import { IProduct } from "../../core/models/product.model";
import { ICategory } from "../../core/models/category.model";
import { ISubcategory } from "../../core/models/subcategory.model";

@Component({
  selector: "app-category-products",
  standalone: true,
  imports: [RouterLink, ProductList],
  templateUrl: "./category-products.html",
  styleUrl: "./category-products.css",
})
export class CategoryProducts implements OnInit {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];

  categories: ICategory[] = [];
  category: ICategory | null = null;

  categorySlug = "";
  categoryName = "";
  categoryTheme = "theme-default";

  subcategories: ISubcategory[] = [];
  subcategorySlug = "";
  subcategoryName = "";

  errorMessage = "";

  currentView: ProductsView = "grid3";

  sortBy = "newest";
  isSortOpen = false;
  isFilterOpen = false;

  filterInStock = false;
  filterNewArrival = false;
  filterTopSeller = false;

  minPrice = 0;
  maxPrice = 5000;

  selectedMinPrice = 0;
  selectedMaxPrice = 5000;

  availableSizes: string[] = [];
  selectedSizes: string[] = [];

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSubcategories();

    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap,
    ]).subscribe(([params, queryParams]) => {
      const slug = (params.get("slug") || "")
        .trim()
        .toLowerCase();

      const subcategory = (queryParams.get("subcategory") || "")
        .trim()
        .toLowerCase();

      this.resetCategoryState();

      if (!slug) {
        this.categorySlug = "";
        this.subcategorySlug = "";
        this.errorMessage = "Category not found.";

        this._cdr.detectChanges();

        this.goToNotFound();
        return;
      }

      this.categorySlug = slug;
      this.subcategorySlug = subcategory;

      this.loadCategory();
    });
  }

  private goToNotFound(): void {
    void this.router.navigateByUrl("/not-found", {
      replaceUrl: true,
    });
  }

  private resetCategoryState(): void {
    this.category = null;
    this.categoryName = "";
    this.categoryTheme = "theme-default";

    this.subcategoryName = "";

    this.products = [];
    this.filteredProducts = [];

    this.errorMessage = "";

    this.minPrice = 0;
    this.maxPrice = 5000;

    this.selectedMinPrice = 0;
    this.selectedMaxPrice = 5000;

    this.availableSizes = [];
    this.selectedSizes = [];

    this.currentPage = 1;
    this.totalPages = 1;

    this.isSortOpen = false;
    this.isFilterOpen = false;

    this.filterInStock = false;
    this.filterNewArrival = false;
    this.filterTopSeller = false;

    this.sortBy = "newest";

    this._cdr.detectChanges();
  }

  loadCategory(): void {
    const requestedSlug = this.categorySlug;

    if (!requestedSlug) {
      this.goToNotFound();
      return;
    }

    this.categoryService.getHomeCategories().subscribe({
      next: (categories) => {
        this.categories = [...categories];

        const matchedCategory =
          categories.find(
            (item) =>
              item.slug?.trim().toLowerCase() ===
              requestedSlug,
          ) || null;

        if (!matchedCategory) {
          this.category = null;
          this.categoryName = "";
          this.categoryTheme = "theme-default";
          this.subcategoryName = "";

          this.products = [];
          this.filteredProducts = [];

          this.errorMessage = "Category not found.";

          this._cdr.detectChanges();

          this.goToNotFound();
          return;
        }

        this.category = matchedCategory;
        this.categoryName = matchedCategory.name;

        this.categoryTheme = this.getCategoryTheme(
          matchedCategory.slug,
        );

        this.resolveSubcategoryName();
        this.loadProducts();
      },

      error: (err) => {
        console.error(
          "[CategoryProducts] Category load error:",
          err,
        );

        this.category = null;
        this.categoryName = "";
        this.categoryTheme = "theme-default";

        this.products = [];
        this.filteredProducts = [];

        this.totalPages = 1;
        this.currentPage = 1;

        this.errorMessage =
          err?.error?.message ||
          "Failed to load category.";

        this._cdr.detectChanges();
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getHomeCategories().subscribe({
      next: (categories) => {
        this.categories = [...categories];
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          "[CategoryProducts] Categories error:",
          err,
        );

        this.categories = [];

        this._cdr.detectChanges();
      },
    });
  }

  loadSubcategories(): void {
    this.subcategoryService.getHomeSubcategories().subscribe({
      next: (subcategories) => {
        this.subcategories = [...subcategories];

        this.resolveSubcategoryName();

        if (this.products.length > 0) {
          this.buildFilterData();
          this.applyFilters();
        }

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          "[CategoryProducts] Subcategories error:",
          err,
        );

        this.subcategories = [];

        this.resolveSubcategoryName();

        this._cdr.detectChanges();
      },
    });
  }

  resolveSubcategoryName(): void {
    if (!this.subcategorySlug) {
      this.subcategoryName = "";
      this._cdr.detectChanges();
      return;
    }

    const subcategory = this.subcategories.find(
      (item) =>
        item.slug?.trim().toLowerCase() ===
        this.subcategorySlug.trim().toLowerCase(),
    );

    if (subcategory) {
      this.subcategoryName = subcategory.name;
    } else {
      this.subcategoryName = this.formatSlug(
        this.subcategorySlug,
      );
    }

    this._cdr.detectChanges();
  }

  loadProducts(): void {
    const slug = this.categorySlug;

    if (!slug) {
      return;
    }

    this.productService.getProductsByCategory(slug).subscribe({
      next: (products) => {
        this.products = [...products];

        this.errorMessage = "";

        this.buildFilterData();
        this.applyFilters();

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error(
          "[CategoryProducts] Products error:",
          err,
        );

        this.products = [];
        this.filteredProducts = [];

        this.totalPages = 1;
        this.currentPage = 1;

        this.errorMessage =
          err?.error?.message ||
          "Failed to load products.";

        this._cdr.detectChanges();
      },
    });
  }

  getScopedProducts(): IProduct[] {
    if (!this.subcategorySlug) {
      return [...this.products];
    }

    return this.products.filter((product) => {
      const subcategory =
        this.getProductSubcategory(product);

      if (!subcategory) {
        return false;
      }

      if (typeof subcategory === "object") {
        const slug = String(
          subcategory?.slug || "",
        )
          .trim()
          .toLowerCase();

        return slug === this.subcategorySlug;
      }

      const value = String(subcategory)
        .trim()
        .toLowerCase();

      const matchedSubcategory =
        this.subcategories.find((item) => {
          const sameSlug =
            item.slug?.toLowerCase() === value;

          const sameId = item._id === value;

          return sameSlug || sameId;
        });

      if (matchedSubcategory) {
        return (
          matchedSubcategory.slug.toLowerCase() ===
          this.subcategorySlug
        );
      }

      return value === this.subcategorySlug;
    });
  }

  getProductSubcategory(
    product: IProduct,
  ): string | ISubcategory | null {
    const item = product as any;

    return item?.subCategory || null;
  }

  getSubcategoryCategoryId(
    category:
      | string
      | {
          _id: string;
          name: string;
          slug: string;
        },
  ): string {
    if (typeof category === "string") {
      return category;
    }

    return category._id;
  }

  buildFilterData(): void {
    const scopedProducts =
      this.getScopedProducts();

    if (!scopedProducts.length) {
      this.minPrice = 0;
      this.maxPrice = 5000;

      this.selectedMinPrice = 0;
      this.selectedMaxPrice = 5000;

      this.availableSizes = [];

      this._cdr.detectChanges();

      return;
    }

    const prices = scopedProducts
      .map((product) => Number(product.price))
      .filter((price) => !Number.isNaN(price));

    if (prices.length) {
      const lowestPrice = Math.floor(
        Math.min(...prices),
      );

      const highestPrice = Math.ceil(
        Math.max(...prices),
      );

      this.minPrice = lowestPrice;

      this.maxPrice =
        highestPrice > lowestPrice
          ? highestPrice
          : lowestPrice + 1;

      this.selectedMinPrice = this.minPrice;
      this.selectedMaxPrice = this.maxPrice;
    }

    const sizes = scopedProducts.flatMap((product) =>
      this.getProductSizes(product),
    );

    this.availableSizes = [
      ...new Set(
        sizes
          .map((size) => size.trim())
          .filter(Boolean),
      ),
    ];

    this._cdr.detectChanges();
  }

  getProductSizes(product: IProduct): string[] {
    const item = product as any;

    if (Array.isArray(item?.sizes)) {
      return item.sizes.map((size: unknown) =>
        String(size),
      );
    }

    if (Array.isArray(item?.size)) {
      return item.size.map((size: unknown) =>
        String(size),
      );
    }

    if (item?.size) {
      return [String(item.size)];
    }

    return [];
  }

  applyFilters(): void {
    let result = this.getScopedProducts();

    if (this.filterInStock) {
      result = result.filter(
        (product) =>
          Number(product.stock || 0) > 0,
      );
    }

    if (this.filterNewArrival) {
      result = result.filter(
        (product) =>
          product.isNewArrival === true,
      );
    }

    if (this.filterTopSeller) {
      result = result.filter(
        (product) =>
          product.isTopSeller === true,
      );
    }

    result = result.filter((product) => {
      const price = Number(product.price);

      return (
        price >= this.selectedMinPrice &&
        price <= this.selectedMaxPrice
      );
    });

    if (this.selectedSizes.length) {
      result = result.filter((product) => {
        const productSizes =
          this.getProductSizes(product).map(
            (size) => size.toLowerCase(),
          );

        return this.selectedSizes.some((size) =>
          productSizes.includes(
            size.toLowerCase(),
          ),
        );
      });
    }

    this.filteredProducts = [...result];

    this.sortFilteredProducts();
    this.updatePagination();

    this._cdr.detectChanges();
  }

  toggleStockFilter(): void {
    this.filterInStock =
      !this.filterInStock;

    this.currentPage = 1;

    this.applyFilters();
  }

  toggleNewArrivalFilter(): void {
    this.filterNewArrival =
      !this.filterNewArrival;

    this.currentPage = 1;

    this.applyFilters();
  }

  toggleTopSellerFilter(): void {
    this.filterTopSeller =
      !this.filterTopSeller;

    this.currentPage = 1;

    this.applyFilters();
  }

  onMinPriceChange(value: string): void {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    this.selectedMinPrice = Math.min(
      numericValue,
      this.selectedMaxPrice,
    );

    this.currentPage = 1;

    this.applyFilters();
  }

  onMaxPriceChange(value: string): void {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    this.selectedMaxPrice = Math.max(
      numericValue,
      this.selectedMinPrice,
    );

    this.currentPage = 1;

    this.applyFilters();
  }

  toggleSize(size: string): void {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes =
        this.selectedSizes.filter(
          (item) => item !== size,
        );
    } else {
      this.selectedSizes = [
        ...this.selectedSizes,
        size,
      ];
    }

    this.currentPage = 1;

    this.applyFilters();
  }

  clearFilters(): void {
    this.filterInStock = false;
    this.filterNewArrival = false;
    this.filterTopSeller = false;
    this.selectedSizes = [];

    const scopedProducts =
      this.getScopedProducts();

    const prices = scopedProducts
      .map((product) => Number(product.price))
      .filter((price) => !Number.isNaN(price));

    if (prices.length) {
      this.selectedMinPrice = Math.floor(
        Math.min(...prices),
      );

      this.selectedMaxPrice = Math.ceil(
        Math.max(...prices),
      );
    } else {
      this.selectedMinPrice = this.minPrice;
      this.selectedMaxPrice = this.maxPrice;
    }

    this.currentPage = 1;

    this.applyFilters();
  }

  getActiveFilterCount(): number {
    let count = 0;

    if (this.filterInStock) {
      count++;
    }

    if (this.filterNewArrival) {
      count++;
    }

    if (this.filterTopSeller) {
      count++;
    }

    if (this.selectedMinPrice > this.minPrice) {
      count++;
    }

    if (this.selectedMaxPrice < this.maxPrice) {
      count++;
    }

    count += this.selectedSizes.length;

    return count;
  }

  toggleSort(): void {
    this.isSortOpen =
      !this.isSortOpen;

    this._cdr.detectChanges();
  }

  selectSort(value: string): void {
    this.sortBy = value;
    this.isSortOpen = false;

    this.sortFilteredProducts();

    this.currentPage = 1;

    this.updatePagination();

    this._cdr.detectChanges();
  }

  sortFilteredProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case "price-low":
          return (
            Number(a.price) -
            Number(b.price)
          );

        case "price-high":
          return (
            Number(b.price) -
            Number(a.price)
          );

        case "name":
          return a.name.localeCompare(b.name);

        case "newest":
        default:
          return (
            this.getTime(b.createdAt) -
            this.getTime(a.createdAt)
          );
      }
    });

    this._cdr.detectChanges();
  }

  getSortLabel(): string {
    switch (this.sortBy) {
      case "price-low":
        return "Price: Low to High";

      case "price-high":
        return "Price: High to Low";

      case "name":
        return "Name";

      case "newest":
      default:
        return "Newest";
    }
  }

  updatePagination(): void {
    this.totalPages = Math.max(
      1,
      Math.ceil(
        this.filteredProducts.length /
          this.pageSize,
      ),
    );

    if (
      this.currentPage >
      this.totalPages
    ) {
      this.currentPage =
        this.totalPages;
    }

    this._cdr.detectChanges();
  }

  get paginatedProducts(): IProduct[] {
    const start =
      (this.currentPage - 1) *
      this.pageSize;

    const end =
      start + this.pageSize;

    return this.filteredProducts.slice(
      start,
      end,
    );
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];

    for (
      let page = 1;
      page <= this.totalPages;
      page++
    ) {
      pages.push(page);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.currentPage = page;

    this._cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  previousPage(): void {
    this.goToPage(
      this.currentPage - 1,
    );
  }

  nextPage(): void {
    this.goToPage(
      this.currentPage + 1,
    );
  }

  setView(view: ProductsView): void {
    this.currentView = view;

    this._cdr.detectChanges();
  }

  toggleFilters(): void {
    this.isFilterOpen =
      !this.isFilterOpen;

    this._cdr.detectChanges();
  }

  closeFilters(): void {
    this.isFilterOpen = false;

    this._cdr.detectChanges();
  }

  getCategoryTheme(slug: string): string {
    switch (slug.toLowerCase()) {
      case "men":
        return "theme-men";

      case "women":
        return "theme-women";

      default:
        return "theme-default";
    }
  }

  formatSlug(slug: string): string {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase(),
      );
  }

  getTime(value?: string): number {
    if (!value) {
      return 0;
    }

    return new Date(value).getTime();
  }

  getCollectionLabel(): string {
    if (this.subcategoryName) {
      return (
        this.categoryName +
        " / " +
        this.subcategoryName
      );
    }

    return this.categoryName;
  }
}