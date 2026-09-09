import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { CategoryCard } from "../category-card/category-card";

import { ICategory } from "../../../core/models/category.model";

import { CategoryService } from "../../../core/services/category.service";

@Component({
  selector: "app-category-list",
  standalone: true,
  imports: [RouterLink, CategoryCard],
  templateUrl: "./category-list.html",
  styleUrl: "./category-list.css",
})
export class CategoryList implements OnInit {
  categories: ICategory[] = [];

  errorMessage = "";

  constructor(
    private categoryService: CategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;

      this._cdr.detectChanges();
    });

    this.getCategories();
  }

  getCategories(): void {
    this.errorMessage = "";

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

  toggleActive(event: { id: string; isActive: boolean }): void {
    this.categoryService
      .toggleCategoryActive(event.id, event.isActive)
      .subscribe({
        next: () => {
          this._cdr.detectChanges();
        },

        error: (err) => {
          console.log(err);

          this.errorMessage =
            err?.error?.message || "Failed to update category status";

          this._cdr.detectChanges();
        },
      });
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = err?.error?.message || "Failed to delete category";

        this._cdr.detectChanges();
      },
    });
  }
}
