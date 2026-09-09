import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { RouterLink } from "@angular/router";

import { DatePipe } from "@angular/common";

import { ITestimonial } from "../../../core/models/testimonial.model";

import { TestimonialService } from "../../../core/services/testimonial.service";

@Component({
  selector: "app-testimonial-card",
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: "./testimonial-card.html",
  styleUrl: "./testimonial-card.css",
})
export class TestimonialCard {
  @Input({
    required: true,
  })
  testimonial!: ITestimonial;

  @Input()
  index = 0;

  errorMessage = "";

  constructor(
    private testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}

  getInitial(): string {
    return this.testimonial?.name?.charAt(0)?.toUpperCase() || "U";
  }

  getStatus(): string {
    if (this.testimonial.status === "accepted") {
      return "ACCEPTED";
    }

    if (this.testimonial.status === "rejected") {
      return "REJECTED";
    }

    return "PENDING";
  }

  getStatusClass(): string {
    if (this.testimonial.status === "accepted") {
      return "accepted";
    }

    if (this.testimonial.status === "rejected") {
      return "rejected";
    }

    return "pending";
  }

  accept(): void {
    this.errorMessage = "";

    this.testimonialService.acceptTestimonial(this.testimonial._id).subscribe({
      next: (updated) => {
        if (updated) {
          this.testimonial = updated;
        }

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Accept testimonial error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to accept testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  reject(): void {
    this.errorMessage = "";

    this.testimonialService.rejectTestimonial(this.testimonial._id).subscribe({
      next: (updated) => {
        if (updated) {
          this.testimonial = updated;
        }

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Reject testimonial error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to reject testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  delete(): void {
    const confirmed = window.confirm(
      `Delete testimonial from ${this.testimonial.name}?`,
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = "";

    this.testimonialService.deleteTestimonial(this.testimonial._id).subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Delete testimonial error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to delete testimonial";

        this._cdr.detectChanges();
      },
    });
  }
}
