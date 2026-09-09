import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
  selector: "app-users",
  imports: [],
  templateUrl: "./users.html",
  styleUrl: "./users.css",
})
export class Users {
  constructor(private _cdr: ChangeDetectorRef) {}
}
