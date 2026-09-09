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
  errorMessage = "";
  successMessage = "";
  isSubmitting = false;

  testimonialForm = new FormGroup({
    comment: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(1000),
      ],
    }),

    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ],
    }),
  });

  constructor(
    private testimonialService: TestimonialService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  setRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      return;
    }

    this.testimonialForm.controls.rating.setValue(rating);
    this.testimonialForm.controls.rating.markAsTouched();

    this.errorMessage = "";
    this.successMessage = "";

    this.cdr.detectChanges();
  }

  submitTestimonial(): void {
    this.errorMessage = "";
    this.successMessage = "";

    const commentControl = this.testimonialForm.controls.comment;
    const ratingControl = this.testimonialForm.controls.rating;

    const comment = commentControl.value.trim();
    const rating = ratingControl.value;

    if (!rating || rating < 1 || rating > 5) {
      this.errorMessage = "Please select a rating.";
      ratingControl.markAsTouched();
      this.cdr.detectChanges();
      return;
    }

    if (!comment) {
      this.errorMessage = "Please write your testimonial.";
      commentControl.markAsTouched();
      this.cdr.detectChanges();
      return;
    }

    if (comment.length > 1000) {
      this.errorMessage =
        "Your testimonial must be 1000 characters or less.";

      commentControl.markAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;

    commentControl.setValue(comment);

    this.cdr.detectChanges();

    this.testimonialService
      .createTestimonial(comment, rating)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          this.successMessage =
            "Your testimonial has been submitted successfully and is waiting for review.";

          this.errorMessage = "";

          this.testimonialForm.reset({
            comment: "",
            rating: 0,
          });

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error("Create testimonial error:", err);

          this.isSubmitting = false;

          this.errorMessage =
            err?.error?.message ||
            err?.message ||
            "Failed to submit testimonial. Please try again.";

          this.cdr.detectChanges();
        },
      });
  }

  backToAccount(): void {
    this.router.navigate(["/account"]);
  }
}