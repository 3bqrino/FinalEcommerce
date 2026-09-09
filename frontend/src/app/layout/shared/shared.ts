import { ChangeDetectorRef, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-shared",
  imports: [RouterOutlet],
  templateUrl: "./shared.html",
  styleUrl: "./shared.css",
})
export class Shared {
  constructor(private _cdr: ChangeDetectorRef) {}
}
