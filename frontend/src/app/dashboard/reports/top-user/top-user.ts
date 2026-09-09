import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

import { DecimalPipe } from "@angular/common";

import { ITopUser } from "../../../core/models/report.model";

@Component({
  selector: "app-top-user",

  standalone: true,

  imports: [DecimalPipe],

  templateUrl: "./top-user.html",

  styleUrl: "./top-user.css",
})
export class TopUser implements OnChanges {
  @Input()
  users: ITopUser[] = [];

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["users"]) {
      this._cdr.detectChanges();
    }
  }

  getInitials(name: string): string {
    if (!name?.trim()) {
      return "U";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
}
