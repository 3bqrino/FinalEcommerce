import { ChangeDetectorRef, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-promo-banner",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./promo-banner.html",
  styleUrl: "./promo-banner.css",
})
export class PromoBanner {
  constructor(private _cdr: ChangeDetectorRef) {}
}
