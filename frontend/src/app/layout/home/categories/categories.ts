import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { CategoryService } from "../../../core/services/category.service";

import { SubcategoryService } from "../../../core/services/subcategory.service";

import { ICategory } from "../../../core/models/category.model";

import {
  ISubcategory,
  ISubcategoryCategoryRef,
} from "../../../core/models/subcategory.model";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./categories.html",
  styleUrl: "./categories.css",
})
export class Categories implements OnInit {
  categories: ICategory[] = [];

  subcategories: ISubcategory[] = [];

  errorMessage = "";

  constructor(
    private categoryService: CategoryService,

    private subcategoryService: SubcategoryService,

    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getCategories();

    this.getSubcategories();
  }

  getCategories(): void {
    this.categoryService.getHomeCategories().subscribe({
      next: (categories) => {
        this.categories = categories;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Categories load error:", err);

        this.categories = [];

        this.errorMessage = "Failed to load categories";

        this._cdr.detectChanges();
      },
    });
  }

  getSubcategories(): void {
    this.subcategoryService.getHomeSubcategories().subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Subcategories load error:", err);

        this.subcategories = [];

        this._cdr.detectChanges();
      },
    });
  }

  getCategorySubcategories(categoryId: string): ISubcategory[] {
    return this.subcategories.filter(
      (subcategory) => this.getCategoryId(subcategory.category) === categoryId,
    );
  }

  getCategoryId(category: string | ISubcategoryCategoryRef): string {
    if (typeof category === "string") {
      return category;
    }

    return category._id;
  }
}
