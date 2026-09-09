import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";

import { TestimonialService } from "../../../core/services/testimonial.service";
import { ITestimonial } from "../../../core/models/testimonial.model";

@Component({
  selector: "app-testnomial",
  standalone: true,
  imports: [],
  templateUrl: "./testnomial.html",
  styleUrl: "./testnomial.css",
})
export class Testnomial implements OnInit {
  testimonials: ITestimonial[] = [];
  errorMessage = "";

  currentSlide = 0;
  itemsPerSlide = 3;

  constructor(
    private testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getTestimonials();
  }

  get maxSlide(): number {
    return Math.max(
      0,
      this.testimonials.length - this.itemsPerSlide,
    );
  }

  get visibleTestimonials(): ITestimonial[] {
    return this.testimonials.slice(
      this.currentSlide,
      this.currentSlide + this.itemsPerSlide,
    );
  }

  nextSlide(): void {
    if (this.currentSlide >= this.maxSlide) {
      return;
    }

    this.currentSlide++;
    this._cdr.detectChanges();
  }

  previousSlide(): void {
    if (this.currentSlide <= 0) {
      return;
    }

    this.currentSlide--;
    this._cdr.detectChanges();
  }

  goToSlide(index: number): void {
    if (index < 0 || index > this.maxSlide) {
      return;
    }

    this.currentSlide = index;
    this._cdr.detectChanges();
  }

  getTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe({
      next: (testimonials) => {
        this.testimonials = testimonials.filter(
          (testimonial) => testimonial.status === "accepted",
        );

        this.errorMessage = "";
        this.currentSlide = 0;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Testimonials load error:", err);

        this.testimonials = [];
        this.errorMessage = "Failed to load testimonials";
        this.currentSlide = 0;

        this._cdr.detectChanges();
      },
    });
  }
}