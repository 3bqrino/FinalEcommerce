import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
  selector: "app-categories",
  imports: [],
  templateUrl: "./categories.html",
  styleUrl: "./categories.css",
})
export class Categories {
  constructor(private _cdr: ChangeDetectorRef) {}
}
