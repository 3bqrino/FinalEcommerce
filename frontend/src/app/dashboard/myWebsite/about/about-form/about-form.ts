import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AboutService } from "../../../../core/services/about.service";
import { IAbout } from "../../../../core/models/about.model";

@Component({
  selector: "app-about-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./about-form.html",
  styleUrl: "./about-form.css",
})
export class AboutForm implements OnInit {
  isEditMode = false;
  aboutId: string | null = null;

  about: IAbout | null = null;

  title = "";
  description = "";
  founderName = "";
  founderRole = "";
  manifesto = "";
  isActive = true;

  imagePreview: string | null = null;
  secondaryImagePreview: string | null = null;
  founderImagePreview: string | null = null;

  selectedImage: File | null = null;
  selectedSecondaryImage: File | null = null;
  selectedFounderImage: File | null = null;

  errorMessage = "";
  successMessage = "";

  aboutForm = new FormGroup({
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
      updateOn: "change",
    }),
    founderName: new FormControl("", {
      nonNullable: true,
      updateOn: "change",
    }),
    founderRole: new FormControl("", {
      nonNullable: true,
      updateOn: "change",
    }),
    manifesto: new FormControl("", {
      nonNullable: true,
      updateOn: "change",
    }),
    isActive: new FormControl(true, {
      nonNullable: true,
      updateOn: "change",
    }),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aboutService: AboutService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.aboutForm.valueChanges.subscribe(() => {
      const value = this.aboutForm.getRawValue();

      this.title = value.title;
      this.description = value.description;
      this.founderName = value.founderName;
      this.founderRole = value.founderRole;
      this.manifesto = value.manifesto;
      this.isActive = value.isActive;
    });

    this.aboutId = this.route.snapshot.paramMap.get("id");
    this.isEditMode = !!this.aboutId;

    if (this.isEditMode && this.aboutId) {
      this.loadAboutForEdit(this.aboutId);
    }
  }

  loadAboutForEdit(id: string): void {
    this.errorMessage = "";

    this.aboutService.getAbout().subscribe({
      next: (about) => {
        if (!about) {
          this.about = null;
          this.errorMessage = "About information not found";

          this._cdr.detectChanges();

          return;
        }

        if (about._id !== id) {
          this.about = null;
          this.errorMessage = "About information not found";

          this._cdr.detectChanges();

          return;
        }

        this.setAboutData(about);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("About load error:", err);

        this.about = null;

        this.errorMessage =
          err?.error?.message || "Failed to load about information";

        this._cdr.detectChanges();
      },
    });
  }

  setAboutData(about: IAbout): void {
    this.about = about;
    this.aboutId = about._id;

    this.title = about.title || "";
    this.description = about.description || "";
    this.founderName = about.founderName || "";
    this.founderRole = about.founderRole || "";
    this.manifesto = about.manifesto || "";
    this.isActive = about.isActive;

    this.imagePreview = about.image || null;
    this.secondaryImagePreview = about.secondaryImage || null;
    this.founderImagePreview = about.founderImage || null;

    this.selectedImage = null;
    this.selectedSecondaryImage = null;
    this.selectedFounderImage = null;

    this.aboutForm.patchValue(
      {
        title: this.title,
        description: this.description,
        founderName: this.founderName,
        founderRole: this.founderRole,
        manifesto: this.manifesto,
        isActive: this.isActive,
      },
      {
        emitEvent: false,
      },
    );
  }

  toggleActive(): void {
    this.isActive = !this.isActive;

    this.aboutForm.controls.isActive.setValue(this.isActive);

    this._cdr.detectChanges();
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = "Main image must be less than 2MB";
      input.value = "";

      this._cdr.detectChanges();

      return;
    }

    this.errorMessage = "";
    this.selectedImage = file;
    this.imagePreview = URL.createObjectURL(file);

    this._cdr.detectChanges();
  }

  onSecondaryImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = "Secondary image must be less than 2MB";
      input.value = "";

      this._cdr.detectChanges();

      return;
    }

    this.errorMessage = "";
    this.selectedSecondaryImage = file;
    this.secondaryImagePreview = URL.createObjectURL(file);

    this._cdr.detectChanges();
  }

  onFounderImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = "Founder image must be less than 2MB";
      input.value = "";

      this._cdr.detectChanges();

      return;
    }

    this.errorMessage = "";
    this.selectedFounderImage = file;
    this.founderImagePreview = URL.createObjectURL(file);

    this._cdr.detectChanges();
  }

  saveAbout(): void {
    this.aboutForm.markAllAsTouched();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.aboutForm.invalid) {
      if (!this.title.trim()) {
        this.errorMessage = "About title is required";

        this._cdr.detectChanges();

        return;
      }

      if (!this.description.trim()) {
        this.errorMessage = "About description is required";

        this._cdr.detectChanges();

        return;
      }
    }

    if (!this.description.trim()) {
      this.errorMessage = "About description is required";

      this._cdr.detectChanges();

      return;
    }

    const formData = new FormData();

    formData.append("title", this.title.trim());
    formData.append("description", this.description.trim());
    formData.append("founderName", this.founderName.trim());
    formData.append("founderRole", this.founderRole.trim());
    formData.append("manifesto", this.manifesto.trim());
    formData.append("isActive", String(this.isActive));

    if (this.selectedImage) {
      formData.append("image", this.selectedImage);
    }

    if (this.selectedSecondaryImage) {
      formData.append("secondaryImage", this.selectedSecondaryImage);
    }

    if (this.selectedFounderImage) {
      formData.append("founderImage", this.selectedFounderImage);
    }

    if (this.isEditMode && this.aboutId) {
      this.updateAbout(this.aboutId, formData);

      return;
    }

    this.createAbout(formData);
  }

  createAbout(formData: FormData): void {
    this.aboutService.createAbout(formData).subscribe({
      next: (about) => {
        this.setAboutData(about);

        this.isEditMode = true;

        this.successMessage = "About information created successfully";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("About create error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to create about information";

        this._cdr.detectChanges();
      },
    });
  }

  updateAbout(id: string, formData: FormData): void {
    this.aboutService.updateAbout(id, formData).subscribe({
      next: (about) => {
        this.setAboutData(about);

        this.successMessage = "About information updated successfully";

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("About update error:", err);

        this.errorMessage =
          err?.error?.message || "Failed to update about information";

        this._cdr.detectChanges();
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/dashboard/myWebsite/about"]);
  }
}