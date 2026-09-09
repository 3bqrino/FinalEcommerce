import { ChangeDetectorRef, Component } from "@angular/core";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { Router } from "@angular/router";

import { TestimonialService } from "../../../core/services/testimonial.service";

@Component({
  selector: "app-testimonial-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./testimonial-form.html",
  styleUrl: "./testimonial-form.css",
})
export class TestimonialForm {
  comment = "";

  rating = 0;

  errorMessage = "";

  successMessage = "";

  isSubmitting = false;

  testimonialForm = new FormGroup({
    comment: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(1000)],
      updateOn: "change",
    }),
    rating: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(5)],
      updateOn: "change",
    }),
  });

  constructor(
    private testimonialService: TestimonialService,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  setRating(rating: number): void {
    this.rating = rating;
    this.testimonialForm.controls.rating.setValue(rating);

    this.errorMessage = "";

    this._cdr.detectChanges();
  }

  submitTestimonial(): void {
    this.testimonialForm.markAllAsTouched();
    this.errorMessage = "";

    this.successMessage = "";

    if (this.testimonialForm.invalid || !this.rating || !this.comment.trim()) {
      if (!this.rating) {
        this.errorMessage = "Please select a rating";
      } else {
        this.errorMessage = "Please write your testimonial";
      }
      this._cdr.detectChanges();
      return;
    }

    if (!this.rating) {
      this.errorMessage = "Please select a rating";

      this._cdr.detectChanges();

      return;
    }

    if (!this.comment.trim()) {
      this.errorMessage = "Please write your testimonial";

      this._cdr.detectChanges();

      return;
    }

    this.isSubmitting = true;

    this._cdr.detectChanges();

    this.testimonialService
      .createTestimonial(this.comment.trim(), this.rating)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          this.successMessage =
            "Your testimonial has been submitted successfully and is waiting for review.";

          this.comment = "";

          this.rating = 0;
          this.testimonialForm.reset({ comment: "", rating: 0 });

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.log("Create testimonial error:", err);

          this.isSubmitting = false;

          this.errorMessage =
            err?.error?.message || "Failed to submit testimonial";

          this._cdr.detectChanges();
        },
      });
  }

  backToAccount(): void {
    this.router.navigate(["/account"]);
  }
}
