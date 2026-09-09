import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import { ITestimonial } from "../../../core/models/testimonial.model";
import { TestimonialService } from "../../../core/services/testimonial.service";

@Component({
  selector: "app-testimonial-action",
  standalone: true,
  imports: [],
  templateUrl: "./testimonial-action.html",
  styleUrl: "./testimonial-action.css",
})
export class TestimonialAction {
  @Input({ required: true })
  testimonial!: ITestimonial;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  actionCompleted = new EventEmitter<void>();

  selectedAction = "";

  errorMessage = "";

  constructor(
    private testimonialService: TestimonialService,
    private _cdr: ChangeDetectorRef,
  ) {}

  selectAction(action: string): void {
    this.selectedAction = action;
    this.errorMessage = "";

    this._cdr.detectChanges();
  }

  confirmAction(): void {
    if (!this.testimonial || !this.selectedAction) {
      return;
    }

    this.errorMessage = "";

    if (this.selectedAction === "accept") {
      this.acceptTestimonial();
      return;
    }

    if (this.selectedAction === "reject") {
      this.rejectTestimonial();
      return;
    }

    if (this.selectedAction === "delete") {
      this.deleteTestimonial();
    }
  }

  private acceptTestimonial(): void {
    this.testimonialService.acceptTestimonial(this.testimonial._id).subscribe({
      next: (updatedTestimonial) => {
        if (updatedTestimonial) {
          this.testimonial = updatedTestimonial;
        } else {
          this.testimonial = {
            ...this.testimonial,
            status: "accepted",
          };
        }

        this.actionCompleted.emit();
        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to accept testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  private rejectTestimonial(): void {
    this.testimonialService.rejectTestimonial(this.testimonial._id).subscribe({
      next: (updatedTestimonial) => {
        if (updatedTestimonial) {
          this.testimonial = updatedTestimonial;
        } else {
          this.testimonial = {
            ...this.testimonial,
            status: "rejected",
          };
        }

        this.actionCompleted.emit();
        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to reject testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  private deleteTestimonial(): void {
    const confirmed = window.confirm(
      `Delete testimonial from ${this.testimonial.name}?`,
    );

    if (!confirmed) {
      return;
    }

    this.testimonialService.deleteTestimonial(this.testimonial._id).subscribe({
      next: () => {
        this.actionCompleted.emit();
        this.closed.emit();

        this._cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to delete testimonial";

        this._cdr.detectChanges();
      },
    });
  }

  close(): void {
    this.closed.emit();
  }
}
