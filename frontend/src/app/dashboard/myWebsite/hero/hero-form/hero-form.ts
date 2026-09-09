import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { HeroService } from "../../../../core/services/hero.service";
import { IHero } from "../../../../core/models/hero.model";

@Component({
  selector: "app-hero-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./hero-form.html",
  styleUrl: "./hero-form.css",
})
export class HeroForm implements OnInit {
  isEditMode = false;
  heroId: string | null = null;

  hero: IHero | null = null;

  eyebrow = "";
  drop = "";
  title = "";
  accent = "";
  description = "";
  isActive = true;

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  errorMessage = "";
  successMessage = "";

  heroForm = new FormGroup({
    eyebrow: new FormControl("", { nonNullable: true, updateOn: "change" }),
    drop: new FormControl("", { nonNullable: true, updateOn: "change" }),
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    accent: new FormControl("", { nonNullable: true, updateOn: "change" }),
    description: new FormControl("", { nonNullable: true, updateOn: "change" }),
    isActive: new FormControl(true, { nonNullable: true, updateOn: "change" }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.heroForm.valueChanges.subscribe(() => {
      const value = this.heroForm.getRawValue();

      this.eyebrow = value.eyebrow;
      this.drop = value.drop;
      this.title = value.title;
      this.accent = value.accent;
      this.description = value.description;
      this.isActive = value.isActive;
    });

    this.heroId = this.route.snapshot.paramMap.get("id");

    this.isEditMode = !!this.heroId;

    if (this.isEditMode && this.heroId) {
      this.loadHeroForEdit(this.heroId);
    }
  }

  loadHeroForEdit(id: string): void {
    this.errorMessage = "";

    this.heroService.getHeroById(id).subscribe({
      next: (hero) => {
        this.hero = hero;

        this.eyebrow = hero.eyebrow || "";

        this.drop = hero.drop || "";

        this.title = hero.title || "";

        this.accent = hero.accent || "";

        this.description = hero.description || "";

        this.isActive = hero.isActive;

        this.imagePreview = hero.image || null;
        this.heroForm.patchValue(
          {
            eyebrow: this.eyebrow,
            drop: this.drop,
            title: this.title,
            accent: this.accent,
            description: this.description,
            isActive: this.isActive,
          },
          { emitEvent: false },
        );

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Hero load error:", err);

        this.errorMessage = err?.error?.message || "Failed to load hero";

        this._cdr.detectChanges();
      },
    });
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.heroForm.controls.isActive.setValue(this.isActive);
    this._cdr.detectChanges();
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = "Image must be less than 2MB";

      input.value = "";

      this._cdr.detectChanges();

      return;
    }

    this.errorMessage = "";

    this.selectedImage = file;

    this.imagePreview = URL.createObjectURL(file);

    this._cdr.detectChanges();
  }

  saveHero(): void {
    this.heroForm.markAllAsTouched();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.heroForm.invalid || !this.title.trim()) {
      this.errorMessage = "Hero title is required";

      this._cdr.detectChanges();

      return;
    }

    if (!this.isEditMode && !this.selectedImage) {
      this.errorMessage = "Hero image is required";

      this._cdr.detectChanges();

      return;
    }

    const formData = new FormData();

    formData.append("eyebrow", this.eyebrow.trim());

    formData.append("drop", this.drop.trim());

    formData.append("title", this.title.trim());

    formData.append("accent", this.accent.trim());

    formData.append("description", this.description.trim());

    formData.append("isActive", String(this.isActive));

    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    if (this.isEditMode && this.heroId) {
      this.updateHero(this.heroId, formData);

      return;
    }

    this.createHero(formData);
  }
  createHero(formData: FormData): void {
    this.heroService.createHero(formData).subscribe({
      next: (hero) => {
        this.successMessage = "Hero created successfully";

        this.selectedImage = null;
        this.imagePreview = hero.image || null;

        this._cdr.detectChanges();

        this.router.navigate(["/dashboard/myWebsite/hero"]);
      },

      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to create hero";

        this._cdr.detectChanges();
      },
    });
  }

  updateHero(id: string, formData: FormData): void {
    this.heroService.updateHero(id, formData).subscribe({
      next: (hero) => {
        this.hero = hero;

        this.eyebrow = hero.eyebrow || "";

        this.drop = hero.drop || "";

        this.title = hero.title || "";

        this.accent = hero.accent || "";

        this.description = hero.description || "";

        this.isActive = hero.isActive;

        this.imagePreview = hero.image || null;

        this.selectedImage = null;

        this.heroForm.patchValue(
          {
            eyebrow: this.eyebrow,
            drop: this.drop,
            title: this.title,
            accent: this.accent,
            description: this.description,
            isActive: this.isActive,
          },
          { emitEvent: false },
        );

        this.successMessage = "Hero updated successfully";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Hero update error:", err);

        this.errorMessage = err?.error?.message || "Failed to update hero";

        this._cdr.detectChanges();
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/dashboard/myWebsite/hero"]);
  }
}
