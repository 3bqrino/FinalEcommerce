import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { TestimonialService } from "../../core/services/testimonial.service";
import { ITestimonial } from "../../core/models/testimonial.model";
import { TestimonialList } from "./testimonial-list/testimonial-list";

@Component({
  selector: "app-testimonials",
  standalone: true,
  imports: [TestimonialList],
  templateUrl: "./testimonials.html",
  styleUrl: "./testimonials.css",
})
export class Testimonials implements OnInit {
  totalTestimonials = 0;
  pendingTestimonials = 0;
  acceptedTestimonials = 0;
  rejectedTestimonials = 0;

  errorMessage = "";

  constructor(
    private testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.testimonialService.testimonials$.subscribe(
      (testimonials: ITestimonial[]) => {
        this.totalTestimonials = testimonials.length;

        this.pendingTestimonials = testimonials.filter(
          (testimonial) => testimonial.status === "pending",
        ).length;

        this.acceptedTestimonials = testimonials.filter(
          (testimonial) => testimonial.status === "accepted",
        ).length;

        this.rejectedTestimonials = testimonials.filter(
          (testimonial) => testimonial.status === "rejected",
        ).length;

        this._cdr.detectChanges();
      },
    );

    this.getTestimonials();
  }

  getTestimonials(): void {
    this.errorMessage = "";

    this.testimonialService.getAdminTestimonials().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to load testimonials";

        this._cdr.detectChanges();
      },
    });
  }
}
