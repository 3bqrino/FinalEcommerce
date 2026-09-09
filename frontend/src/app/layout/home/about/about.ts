import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { AboutService } from "../../../core/services/about.service";

import { IAbout } from "../../../core/models/about.model";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [],
  templateUrl: "./about.html",
  styleUrl: "./about.css",
})
export class About implements OnInit {
  about: IAbout | null = null;

  errorMessage = "";

  constructor(
    private aboutService: AboutService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAbout();
  }

  getAbout(): void {
    this.aboutService.getAbout().subscribe({
      next: (about) => {
        this.about = about;
        this.errorMessage = "";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("About load error:", err);

        this.about = null;
        this.errorMessage = "Failed to load about section";

        this._cdr.detectChanges();
      },
    });
  }
}