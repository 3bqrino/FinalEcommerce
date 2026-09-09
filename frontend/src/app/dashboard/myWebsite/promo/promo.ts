import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { PromoService } from "../../../core/services/promo.service";

import { IPromo } from "../../../core/models/promo.model";

@Component({
  selector: "app-promo",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./promo.html",
  styleUrl: "./promo.css",
})
export class Promo implements OnInit {
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

    this.getPromo();
  }

  getPromo(): void {
    this.errorMessage = "";
    this.successMessage = "";

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
          err?.error?.message || "Failed to load promo banner";

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

    const trimmedText = this.text.trim();

    const trimmedLink = this.link.trim();

    if (this.promoForm.invalid) {
      if (!trimmedText) {
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
        text: trimmedText,
        discount: this.discount,
        link: trimmedLink,
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
          console.log("Promo update error:", err);

          this.errorMessage =
            err?.error?.message || "Failed to save promo banner";

          this._cdr.detectChanges();
        },
      });
  }
}
