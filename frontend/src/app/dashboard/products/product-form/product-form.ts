import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router, RouterLink } from "@angular/router";

import { ProductService } from "../../../core/services/product.service";

import { CategoryService } from "../../../core/services/category.service";

import { SubcategoryService } from "../../../core/services/subcategory.service";

import { IProductRef } from "../../../core/models/product.model";

import { ICategory } from "../../../core/models/category.model";

import { ISubcategory } from "../../../core/models/subcategory.model";

import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./product-form.html",
  styleUrl: "./product-form.css",
})
export class ProductForm implements OnInit {
  productId = "";

  name = "";

  slug = "";

  description = "";

  price = 0;

  stock = 0;

  category = "";

  subCategory = "";

  isActive = true;

  isNewArrival = false;

  isTopSeller = false;

  imageFile: File | null = null;

  imagePreview = "";

  categories: ICategory[] = [];

  subcategories: ISubcategory[] = [];

  availableSubcategories: ISubcategory[] = [];

  errorMessage = "";

  successMessage = "";

  saving = false;

  productForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    slug: new FormControl("", { nonNullable: true, updateOn: "change" }),
    description: new FormControl("", { nonNullable: true, updateOn: "change" }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
      updateOn: "change",
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
      updateOn: "change",
    }),
    category: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    subCategory: new FormControl("", { nonNullable: true, updateOn: "change" }),
    isActive: new FormControl(true, { nonNullable: true, updateOn: "change" }),
    isNewArrival: new FormControl(false, {
      nonNullable: true,
      updateOn: "change",
    }),
    isTopSeller: new FormControl(false, {
      nonNullable: true,
      updateOn: "change",
    }),
  });

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productForm.valueChanges.subscribe(() => {
      const value = this.productForm.getRawValue();
      const categoryChanged = this.category !== value.category;

      this.name = value.name;
      this.slug = value.slug;
      this.description = value.description;
      this.price = value.price;
      this.stock = value.stock;
      this.category = value.category;
      this.subCategory = value.subCategory;
      this.isActive = value.isActive;
      this.isNewArrival = value.isNewArrival;
      this.isTopSeller = value.isTopSeller;

      if (categoryChanged) {
        this.onCategoryChange();
      }
    });

    this.productId = this.route.snapshot.paramMap.get("id") || "";

    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories.filter((category) => category.isActive);

      this.updateAvailableSubcategories();

      this._cdr.detectChanges();
    });

    this.subcategoryService.subcategories$.subscribe((subcategories) => {
      this.subcategories = subcategories.filter(
        (subcategory) => subcategory.isActive,
      );

      this.updateAvailableSubcategories();

      this._cdr.detectChanges();
    });

    this.categoryService.getAllCategories().subscribe({
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to load categories.";

        this._cdr.detectChanges();
      },
    });

    this.subcategoryService.getAllSubcategories().subscribe({
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to load subcategories.";

        this._cdr.detectChanges();
      },
    });

    if (this.productId) {
      this.getProduct();
    }
  }

  getProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.name = product.name || "";

        this.slug = product.slug || "";

        this.description = product.description || "";

        this.price = product.price || 0;

        this.stock = product.stock || 0;

        this.category = this.getRefId(product.category);

        this.subCategory = this.getRefId(product.subCategory);

        this.isActive = product.isActive ?? true;

        this.isNewArrival = product.isNewArrival ?? false;

        this.isTopSeller = product.isTopSeller ?? false;

        if (product.image) {
          this.imagePreview = this.getImageUrl(product.image);
        }

        this.updateAvailableSubcategories();
        this.productForm.patchValue(
          {
            name: this.name,
            slug: this.slug,
            description: this.description,
            price: this.price,
            stock: this.stock,
            category: this.category,
            subCategory: this.subCategory,
            isActive: this.isActive,
            isNewArrival: this.isNewArrival,
            isTopSeller: this.isTopSeller,
          },
          { emitEvent: false },
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to load product.";

        this._cdr.detectChanges();
      },
    });
  }

  onCategoryChange(): void {
    this.subCategory = "";
    this.productForm.controls.subCategory.setValue("", { emitEvent: false });

    this.updateAvailableSubcategories();

    this._cdr.detectChanges();
  }

  updateAvailableSubcategories(): void {
    if (!this.category) {
      this.availableSubcategories = [];

      return;
    }

    this.availableSubcategories = this.subcategories.filter((subcategory) => {
      const categoryId = this.getRefId(subcategory.category);

      return categoryId === this.category;
    });

    const exists = this.availableSubcategories.some(
      (subcategory) => subcategory._id === this.subCategory,
    );

    if (!exists) {
      this.subCategory = "";
      this.productForm.controls.subCategory.setValue("", { emitEvent: false });
    }
  }

  getRefId(
    value: string | IProductRef | { _id?: string } | null | undefined,
  ): string {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    return value._id || "";
  }

  getCategoryName(): string {
    const category = this.categories.find((item) => item._id === this.category);

    return category?.name || "Select category";
  }

  getSubcategoryName(): string {
    const subcategory = this.availableSubcategories.find(
      (item) => item._id === this.subCategory,
    );

    return subcategory?.name || "None";
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.imageFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;

      this._cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageFile = null;

    this.imagePreview = "";

    this._cdr.detectChanges();
  }

  saveProduct(): void {
    this.productForm.markAllAsTouched();
    this.errorMessage = "";

    this.successMessage = "";

    if (this.productForm.invalid) {
      if (!this.name.trim()) {
        this.errorMessage = "Product name is required.";
      } else if (!this.category) {
        this.errorMessage = "Please select a category.";
      } else if (this.price < 0) {
        this.errorMessage = "Price cannot be negative.";
      } else {
        this.errorMessage = "Stock cannot be negative.";
      }
      this._cdr.detectChanges();
      return;
    }

    if (!this.name.trim()) {
      this.errorMessage = "Product name is required.";

      this._cdr.detectChanges();

      return;
    }

    if (!this.category) {
      this.errorMessage = "Please select a category.";

      this._cdr.detectChanges();

      return;
    }

    if (this.price < 0) {
      this.errorMessage = "Price cannot be negative.";

      this._cdr.detectChanges();

      return;
    }

    if (this.stock < 0) {
      this.errorMessage = "Stock cannot be negative.";

      this._cdr.detectChanges();

      return;
    }

    const formData = new FormData();

    formData.append("name", this.name.trim());

    formData.append("slug", this.slug.trim());

    formData.append("description", this.description.trim());

    formData.append("price", String(this.price));

    formData.append("stock", String(this.stock));

    formData.append("category", this.category);

    formData.append("isActive", String(this.isActive));

    formData.append("isNewArrival", String(this.isNewArrival));

    formData.append("isTopSeller", String(this.isTopSeller));

    if (this.subCategory) {
      formData.append("subCategory", this.subCategory);
    }

    if (this.imageFile) {
      formData.append("image", this.imageFile);
    }

    this.saving = true;

    const request$ = this.productId
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    request$.subscribe({
      next: () => {
        this.saving = false;

        this.successMessage = this.productId
          ? "Product updated successfully."
          : "Product created successfully.";

        this._cdr.detectChanges();

        this.router.navigate(["/dashboard/products"]);
      },

      error: (err) => {
        this.saving = false;

        this.errorMessage = err?.error?.message || "Something went wrong.";

        this._cdr.detectChanges();
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/dashboard/products"]);
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
