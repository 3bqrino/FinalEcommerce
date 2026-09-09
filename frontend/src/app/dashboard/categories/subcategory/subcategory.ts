import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
  selector: "app-subcategory",
  imports: [],
  templateUrl: "./subcategory.html",
  styleUrl: "./subcategory.css",
})
export class Subcategory {
  constructor(private _cdr: ChangeDetectorRef) {}
}
