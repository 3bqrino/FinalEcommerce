import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
  selector: "app-address",
  imports: [],
  templateUrl: "./address.html",
  styleUrl: "./address.css",
})
export class Address {
  constructor(private _cdr: ChangeDetectorRef) {}
}
