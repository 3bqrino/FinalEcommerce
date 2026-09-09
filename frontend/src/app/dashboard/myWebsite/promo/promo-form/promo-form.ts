import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { PromoService } from "../../../../core/services/promo.service";
import { IPromo } from "../../../../core/models/promo.model";

@Component({
  selector: "app-promo-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./promo-form.html",
  styleUrl: "./promo-form.css",
})
export class PromoForm implements OnInit {
  promo: IPromo | null = null;

  text = "";
  discount: number | null = null;
  link = "";
  isActive = true;

  errorMessage = "";
  successMessage = "";

  promoForm = new FormGroup({
    text: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    discount: new FormControl<number | null>(null, {
      validators: [Validators.min(0)],
      updateOn: "change",
    }),
    link: new FormControl("", { nonNullable: true, updateOn: "change" }),
    isActive: new FormControl(true, { nonNullable: true, updateOn: "change" }),
  });

  constructor(
    private router: Router,
    private promoService: PromoService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.promoForm.valueChanges.subscribe(() => {
      const value = this.promoForm.getRawValue();

      this.text = value.text;
      this.discount = value.discount;
      this.link = value.link;
      this.isActive = value.isActive;
    });

    this.loadPromo();
  }

  loadPromo(): void {
    this.errorMessage = "";

    this.promoService.getPromo().subscribe({
      next: (promo) => {
        this.promo = promo;

        this.text = promo.text || "";

        this.discount = promo.discount ?? null;

        this.link = promo.link || "";

        this.isActive = promo.isActive;
        this.promoForm.patchValue(
          {
            text: this.text,
            discount: this.discount,
            link: this.link,
            isActive: this.isActive,
          },
          { emitEvent: false },
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Promo load error:", err);

        this.promo = null;

        this.errorMessage =
          err?.error?.message || "Promo banner does not exist yet";

        this._cdr.detectChanges();
      },
    });
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.promoForm.controls.isActive.setValue(this.isActive);
    this._cdr.detectChanges();
  }

  savePromo(): void {
    this.promoForm.markAllAsTouched();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.promoForm.invalid) {
      if (!this.text.trim()) {
        this.errorMessage = "Promo banner text is required";

        this._cdr.detectChanges();

        return;
      }

      if (this.discount !== null && this.discount < 0) {
        this.errorMessage = "Discount must be a valid positive number";

        this._cdr.detectChanges();

        return;
      }
    }

    if (
      this.discount !== null &&
      (this.discount < 0 || Number.isNaN(this.discount))
    ) {
      this.errorMessage = "Discount must be a valid positive number";

      this._cdr.detectChanges();

      return;
    }

    this.promoService
      .updatePromo({
        text: this.text.trim(),

        discount: this.discount,

        link: this.link.trim(),

        isActive: this.isActive,
      })
      .subscribe({
        next: (promo) => {
          this.promo = promo;

          this.text = promo.text || "";

          this.discount = promo.discount ?? null;

          this.link = promo.link || "";

          this.isActive = promo.isActive;
          this.promoForm.patchValue(
            {
              text: this.text,
              discount: this.discount,
              link: this.link,
              isActive: this.isActive,
            },
            { emitEvent: false },
          );

          this.successMessage = "Promo banner saved successfully";

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.log("Promo save error:", err);

          this.errorMessage =
            err?.error?.message || "Failed to save promo banner";

          this._cdr.detectChanges();
        },
      });
  }

  cancel(): void {
    this.router.navigate(["/dashboard/myWebsite/promo"]);
  }
}
