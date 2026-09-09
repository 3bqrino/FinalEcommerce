import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
  selector: "app-summary",
  standalone: true,
  imports: [],
  templateUrl: "./summary.html",
  styleUrl: "./summary.css",
})
export class Summary {
  constructor(private _cdr: ChangeDetectorRef) {}
}
