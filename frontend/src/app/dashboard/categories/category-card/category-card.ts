import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import { RouterLink } from "@angular/router";

import { ICategory } from "../../../core/models/category.model";

import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-category-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./category-card.html",
  styleUrl: "./category-card.css",
})
export class CategoryCard {
  @Input({
    required: true,
  })
  category!: ICategory;

  @Output()
  deleteClicked = new EventEmitter<string>();

  @Output()
  activeChanged = new EventEmitter<{
    id: string;
    isActive: boolean;
  }>();

  constructor(private _cdr: ChangeDetectorRef) {}

  getImageUrl(image: string): string {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${environment.filesUrl}/${image}`;
  }

  toggleActive(): void {
    this.activeChanged.emit({
      id: this.category._id,
      isActive: !this.category.isActive,
    });
  }

  deleteCategory(): void {
    if (!this.category?._id) {
      return;
    }

    this.deleteClicked.emit(this.category._id);
  }
}
