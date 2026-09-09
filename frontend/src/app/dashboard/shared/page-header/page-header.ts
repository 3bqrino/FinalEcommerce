import { ChangeDetectorRef, Component, Input } from "@angular/core";

@Component({
  selector: "app-page-header",
  standalone: true,
  imports: [],
  templateUrl: "./page-header.html",
  styleUrl: "./page-header.css",
})
export class PageHeader {
  constructor(private _cdr: ChangeDetectorRef) {}

  @Input() title = "";
  @Input() subtitle = "";
}
