import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import { ITestimonial } from "../../../core/models/testimonial.model";
import { TestimonialService } from "../../../core/services/testimonial.service";

@Component({
  selector: "app-testimonial-details",
  standalone: true,
  imports: [],
  templateUrl: "./testimonial-details.html",
  styleUrl: "./testimonial-details.css",
})
export class TestimonialDetails implements OnInit {
  testimonial: ITestimonial | null = null;

  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.errorMessage = "Testimonial id not found";

      this._cdr.detectChanges();

      return;
    }

    this.getTestimonial(id);
  }

  getTestimonial(id: string): void {
    this.errorMessage = "";

    this.testimonialService.getAdminTestimonials().subscribe({
      next: (testimonials) => {
        this.testimonial = testimonials.find((item) => item._id === id) || null;

        if (!this.testimonial) {
          this.errorMessage = "Testimonial not found";
        }

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage = err?.error?.message || "Failed to load testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  acceptTestimonial(): void {
    if (!this.testimonial) {
      return;
    }

    this.testimonialService.acceptTestimonial(this.testimonial._id).subscribe({
      next: () => {
        this.testimonial = {
          ...this.testimonial!,
          status: "accepted",
        };

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage =
          err?.error?.message || "Failed to accept testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  rejectTestimonial(): void {
    if (!this.testimonial) {
      return;
    }

    this.testimonialService.rejectTestimonial(this.testimonial._id).subscribe({
      next: () => {
        this.testimonial = {
          ...this.testimonial!,
          status: "rejected",
        };

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage =
          err?.error?.message || "Failed to reject testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  deleteTestimonial(): void {
    if (!this.testimonial) {
      return;
    }

    this.testimonialService.deleteTestimonial(this.testimonial._id).subscribe({
      next: () => {
        this.goBack();
      },

      error: (err) => {
        console.log(err);

        this.errorMessage =
          err?.error?.message || "Failed to delete testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/dashboard/testimonials"]);
  }
}
