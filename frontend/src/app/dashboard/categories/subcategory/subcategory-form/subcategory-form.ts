import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";

import { SubcategoryService } from "../../../../core/services/subcategory.service";

import { CategoryService } from "../../../../core/services/category.service";

import { ISubcategory } from "../../../../core/models/subcategory.model";

import { ICategory } from "../../../../core/models/category.model";

@Component({
  selector: "app-subcategory-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./subcategory-form.html",
  styleUrl: "./subcategory-form.css",
})
export class SubcategoryForm implements OnInit {
  subcategoryId: string | null = null;

  isEditMode = false;

  name = "";
  slug = "";

  categoryId = "";

  isActive = true;

  categories: ICategory[] = [];

  errorMessage = "";

  subcategoryForm = new FormGroup({
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
    categoryId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    isActive: new FormControl(true, { nonNullable: true, updateOn: "change" }),
  });

  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subcategoryForm.valueChanges.subscribe(() => {
      const value = this.subcategoryForm.getRawValue();

      this.name = value.name;
      this.slug = value.slug;
      this.categoryId = value.categoryId;
      this.isActive = value.isActive;
    });

    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories.filter((category) => category.isActive);

      this._cdr.detectChanges();
    });

    this.loadCategories();

    this.subcategoryId = this.route.snapshot.paramMap.get("id");

    this.isEditMode = !!this.subcategoryId;

    if (this.isEditMode && this.subcategoryId) {
      this.getSubcategory(this.subcategoryId);
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = "Failed to load categories";

        this._cdr.detectChanges();
      },
    });
  }

  getSubcategory(id: string): void {
    this.subcategoryService.getSubcategoryById(id).subscribe({
      next: (res: ISubcategory) => {
        this.name = res.name;

        this.slug = res.slug;

        if (typeof res.category === "string") {
          this.categoryId = res.category;
        } else {
          this.categoryId = res.category._id;
        }

        this.isActive = res.isActive;
        this.subcategoryForm.patchValue(
          {
            name: this.name,
            slug: this.slug,
            categoryId: this.categoryId,
            isActive: this.isActive,
          },
          { emitEvent: false },
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = "Failed to load subcategory";

        this._cdr.detectChanges();
      },
    });
  }

  saveSubcategory(): void {
    this.subcategoryForm.markAllAsTouched();

    if (this.subcategoryForm.invalid) {
      if (!this.name.trim()) {
        this.errorMessage = "Subcategory name is required";
      } else if (!this.slug.trim()) {
        this.errorMessage = "Subcategory slug is required";
      } else {
        this.errorMessage = "Please select a category";
      }
      this._cdr.detectChanges();
      return;
    }

    if (!this.name.trim()) {
      this.errorMessage = "Subcategory name is required";

      this._cdr.detectChanges();

      return;
    }

    if (!this.slug.trim()) {
      this.errorMessage = "Subcategory slug is required";

      this._cdr.detectChanges();

      return;
    }

    if (!this.categoryId) {
      this.errorMessage = "Please select a category";

      this._cdr.detectChanges();

      return;
    }

    this.errorMessage = "";

    const data = {
      name: this.name.trim(),

      slug: this.slug.trim(),

      category: this.categoryId,

      isActive: this.isActive,
    };

    if (this.isEditMode && this.subcategoryId) {
      this.subcategoryService
        .updateSubcategory(this.subcategoryId, data)
        .subscribe({
          next: () => {
            this.router.navigate(["/dashboard/subcategories"]);
          },

          error: (err) => {
            console.log(err);

            this.errorMessage =
              err?.error?.message || "Failed to update subcategory";

            this._cdr.detectChanges();
          },
        });

      return;
    }

    this.subcategoryService.createSubcategory(data).subscribe({
      next: () => {
        this.router.navigate(["/dashboard/subcategories"]);
      },

      error: (err) => {
        console.log(err);

        this.errorMessage =
          err?.error?.message || "Failed to create subcategory";

        this._cdr.detectChanges();
      },
    });
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.subcategoryForm.controls.isActive.setValue(this.isActive);
    this._cdr.detectChanges();
  }
  getSelectedCategoryName(): string {
    const category = this.categories.find(
      (item) => item._id === this.categoryId,
    );

    return category?.name || "Category selected";
  }

  cancel(): void {
    this.router.navigate(["/dashboard/subcategories"]);
  }
}
