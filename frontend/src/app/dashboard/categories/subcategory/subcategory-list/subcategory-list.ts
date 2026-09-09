import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { ISubcategory } from "../../../../core/models/subcategory.model";

import { SubcategoryService } from "../../../../core/services/subcategory.service";

@Component({
  selector: "app-subcategory-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./subcategory-list.html",
  styleUrl: "./subcategory-list.css",
})
export class SubcategoryList implements OnInit {
  subcategories: ISubcategory[] = [];

  errorMessage = "";

  constructor(
    private subcategoryService: SubcategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subcategoryService.subcategories$.subscribe((subcategories) => {
      this.subcategories = subcategories;

      this._cdr.detectChanges();
    });

    this.getSubcategories();
  }

  getCategoryName(category: string | { name: string }): string {
    return typeof category === "object" ? category.name : category;
  }

  getSubcategories(): void {
    this.errorMessage = "";

    this.subcategoryService.getAllSubcategories().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to load subcategories";

        this._cdr.detectChanges();
      },
    });
  }

  deleteSubcategory(id: string): void {
    this.subcategoryService.deleteSubcategory(id).subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage =
          err?.error?.message || "Failed to delete subcategory";

        this._cdr.detectChanges();
      },
    });
  }
}
