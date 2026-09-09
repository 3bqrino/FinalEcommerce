import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
  selector: "app-footer",
  imports: [],
  templateUrl: "./footer.html",
  styleUrl: "./footer.css",
})
export class Footer {
  constructor(private _cdr: ChangeDetectorRef) {}
}
