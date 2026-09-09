import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

import { CategoryService } from "../../../core/services/category.service";
import { ICategory } from "../../../core/models/category.model";

@Component({
  selector: "app-category-details",
  standalone: true,
  imports: [],
  templateUrl: "./categorty-details.html",
  styleUrl: "./categorty-details.css",
})
export class CategoryDetails implements OnInit {
  category: ICategory | null = null;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.errorMessage = "Category id not found";

      return;
    }

    this.getCategory(id);
  }

  getCategory(id: string): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => {
        this.category = category;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = "Failed to load category";

        this._cdr.detectChanges();
      },
    });
  }

  editCategory(): void {
    if (!this.category) {
      return;
    }

    this.router.navigate(["/dashboard/categories", this.category._id, "edit"]);
  }
  getImageUrl(image: string): string {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${environment.filesUrl}/${image}`;
  }
  deleteCategory(): void {
    if (!this.category) {
      return;
    }

    this.categoryService.deleteCategory(this.category._id).subscribe({
      next: () => {
        this.router.navigate(["/dashboard/categories"]);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this._cdr.detectChanges();
      },
    });
  }
  goBack(): void {
    this.router.navigate(["/dashboard/categories"]);
  }
}
