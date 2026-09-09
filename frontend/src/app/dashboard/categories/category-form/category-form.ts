import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";

import { CategoryService } from "../../../core/services/category.service";

import { ICategory } from "../../../core/models/category.model";
import { environment } from "../../../../environments/environment.prod";

@Component({
  selector: "app-category-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./category-form.html",
  styleUrl: "./category-form.css",
})
export class CategoryForm implements OnInit {
  categoryId: string | null = null;

  isEditMode = false;

  name = "";
  slug = "";
  description = "";

  isActive = true;

  categoryForm = new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    slug: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    description: new FormControl("", { nonNullable: true, updateOn: "change" }),
    isActive: new FormControl(true, { nonNullable: true, updateOn: "change" }),
  });

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.categoryForm.valueChanges.subscribe(() => {
      const value = this.categoryForm.getRawValue();

      this.name = value.name;
      this.slug = value.slug;
      this.description = value.description;
      this.isActive = value.isActive;
    });

    this.categoryId = this.route.snapshot.paramMap.get("id");

    this.isEditMode = !!this.categoryId;

    if (this.isEditMode && this.categoryId) {
      this.getCategory(this.categoryId);
    }
  }

  getCategory(id: string): void {
    this.errorMessage = "";

    this.categoryService.getCategoryById(id).subscribe({
      next: (category: ICategory) => {
        this.name = category.name;

        this.slug = category.slug;

        this.description = category.description;

        this.isActive = category.isActive;

        this.imagePreview = category.image
          ? `${environment.filesUrl}/${category.image}`
          : null;
        this.categoryForm.patchValue(
          {
            name: this.name,
            slug: this.slug,
            description: this.description,
            isActive: this.isActive,
          },
          { emitEvent: false },
        );
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = err?.error?.message || "Failed to load category";
        this._cdr.detectChanges();
      },
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedImage = input.files[0];

    this.imagePreview = URL.createObjectURL(this.selectedImage);

    this._cdr.detectChanges();
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.categoryForm.controls.isActive.setValue(this.isActive);
    this._cdr.detectChanges();
  }

  saveCategory(): void {
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid) {
      this.errorMessage = !this.name.trim()
        ? "Category name is required"
        : "Category slug is required";
      this._cdr.detectChanges();
      return;
    }

    if (!this.name.trim()) {
      this.errorMessage = "Category name is required";

      return;
    }

    if (!this.slug.trim()) {
      this.errorMessage = "Category slug is required";

      return;
    }
    this.errorMessage = "";

    const formData = new FormData();

    formData.append("name", this.name.trim());

    formData.append("slug", this.slug.trim());

    formData.append("description", this.description.trim());

    formData.append("isActive", String(this.isActive));

    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, formData).subscribe({
        next: () => {
          this._cdr.detectChanges();

          this.router.navigate(["/dashboard/categories"]);
        },

        error: (err) => {
          console.log(err);

          this.errorMessage =
            err?.error?.message || "Failed to update category";
          this._cdr.detectChanges();
        },
      });

      return;
    }

    this.categoryService.createCategory(formData).subscribe({
      next: () => {
        this._cdr.detectChanges();

        this.router.navigate(["/dashboard/categories"]);
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = err?.error?.message || "Failed to create category";
        this._cdr.detectChanges();
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/dashboard/categories"]);
  }
}
