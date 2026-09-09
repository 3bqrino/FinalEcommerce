import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ITestimonial } from "../../../core/models/testimonial.model";

import { TestimonialService } from "../../../core/services/testimonial.service";

import { TestimonialCard } from "../testimonial-card/testimonial-card";

@Component({
  selector: "app-testimonial-list",
  standalone: true,
  imports: [TestimonialCard],
  templateUrl: "./testimonial-list.html",
  styleUrl: "./testimonial-list.css",
})
export class TestimonialList implements OnInit {
  testimonials: ITestimonial[] = [];

  errorMessage = "";

  constructor(
    private testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.testimonialService.testimonials$.subscribe((testimonials) => {
      this.testimonials = testimonials;

      this._cdr.detectChanges();
    });
  }

  getTestimonials(): void {
    this.errorMessage = "";

    this.testimonialService.getAdminTestimonials().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Get testimonials error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to load testimonials";

        this._cdr.detectChanges();
      },
    });
  }
}
