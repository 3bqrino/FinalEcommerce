import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { Router } from "@angular/router";

import { FooterService } from "../../../core/services/footer.service";

import { IFooter } from "../../../core/models/footer.model";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./footer.html",
  styleUrl: "./footer.css",
})
export class Footer implements OnInit {
  footer: IFooter | null = null;

  errorMessage = "";

  successMessage = "";

  isSaving = false;

  footerForm = new FormGroup({
    newsletterTitle: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),

    newsletterDescription: new FormControl("", {
      nonNullable: true,
    }),

    newsletterNote: new FormControl("", {
      nonNullable: true,
    }),

    brandName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),

    brandDescription: new FormControl("", {
      nonNullable: true,
    }),

    instagram: new FormControl("", {
      nonNullable: true,
    }),

    tiktok: new FormControl("", {
      nonNullable: true,
    }),

    twitter: new FormControl("", {
      nonNullable: true,
    }),

    youtube: new FormControl("", {
      nonNullable: true,
    }),

    shopLinks: new FormArray<
      FormGroup<{
        label: FormControl<string>;
        link: FormControl<string>;
      }>
    >([]),

    brandLinks: new FormArray<
      FormGroup<{
        label: FormControl<string>;
        link: FormControl<string>;
      }>
    >([]),

    supportLinks: new FormArray<
      FormGroup<{
        label: FormControl<string>;
        link: FormControl<string>;
      }>
    >([]),

    shippingBadgeNumber: new FormControl("", {
      nonNullable: true,
    }),

    shippingBadgeTitle: new FormControl("", {
      nonNullable: true,
    }),

    shippingBadgeText: new FormControl("", {
      nonNullable: true,
    }),

    copyrightText: new FormControl("", {
      nonNullable: true,
    }),

    rightsText: new FormControl("", {
      nonNullable: true,
    }),

    privacyLink: new FormControl("", {
      nonNullable: true,
    }),

    privacyLabel: new FormControl("", {
      nonNullable: true,
    }),

    termsLink: new FormControl("", {
      nonNullable: true,
    }),

    termsLabel: new FormControl("", {
      nonNullable: true,
    }),

    isActive: new FormControl(true, {
      nonNullable: true,
    }),
  });

  constructor(
    private footerService: FooterService,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getFooter();
  }

  getFooter(): void {
    this.errorMessage = "";

    this.footerService.getFooter().subscribe({
      next: (footer) => {
        this.footer = footer;

        this.fillForm(footer);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Footer load error:", err);

        this.errorMessage = err?.error?.message || "Failed to load footer.";

        this._cdr.detectChanges();
      },
    });
  }

  fillForm(footer: IFooter): void {
    this.footerForm.patchValue({
      newsletterTitle: footer.newsletterTitle,

      newsletterDescription: footer.newsletterDescription,

      newsletterNote: footer.newsletterNote,

      brandName: footer.brandName,

      brandDescription: footer.brandDescription,

      instagram: footer.instagram,

      tiktok: footer.tiktok,

      twitter: footer.twitter,

      youtube: footer.youtube,

      shippingBadgeNumber: footer.shippingBadgeNumber,

      shippingBadgeTitle: footer.shippingBadgeTitle,

      shippingBadgeText: footer.shippingBadgeText,

      copyrightText: footer.copyrightText,

      rightsText: footer.rightsText,

      privacyLink: footer.privacyLink,

      privacyLabel: footer.privacyLabel,

      termsLink: footer.termsLink,

      termsLabel: footer.termsLabel,

      isActive: footer.isActive,
    });

    this.setLinks("shopLinks", footer.shopLinks);

    this.setLinks("brandLinks", footer.brandLinks);

    this.setLinks("supportLinks", footer.supportLinks);
  }

  get shopLinks(): FormArray {
    return this.footerForm.get("shopLinks") as FormArray;
  }

  get brandLinks(): FormArray {
    return this.footerForm.get("brandLinks") as FormArray;
  }

  get supportLinks(): FormArray {
    return this.footerForm.get("supportLinks") as FormArray;
  }

  createLink(label = "", link = ""): FormGroup {
    return new FormGroup({
      label: new FormControl(label, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      link: new FormControl(link, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  addShopLink(): void {
    this.shopLinks.push(this.createLink());

    this._cdr.detectChanges();
  }

  removeShopLink(index: number): void {
    this.shopLinks.removeAt(index);

    this._cdr.detectChanges();
  }

  addBrandLink(): void {
    this.brandLinks.push(this.createLink());

    this._cdr.detectChanges();
  }

  removeBrandLink(index: number): void {
    this.brandLinks.removeAt(index);

    this._cdr.detectChanges();
  }

  addSupportLink(): void {
    this.supportLinks.push(this.createLink());

    this._cdr.detectChanges();
  }

  removeSupportLink(index: number): void {
    this.supportLinks.removeAt(index);

    this._cdr.detectChanges();
  }

  setLinks(
    groupName: "shopLinks" | "brandLinks" | "supportLinks",
    links: {
      label: string;
      link: string;
    }[],
  ): void {
    const formArray = this.footerForm.get(groupName) as FormArray;

    formArray.clear();

    links.forEach((item) => {
      formArray.push(this.createLink(item.label, item.link));
    });
  }

  saveFooter(): void {
    this.errorMessage = "";

    this.successMessage = "";

    if (this.footerForm.invalid) {
      this.footerForm.markAllAsTouched();

      this.errorMessage = "Please complete the required fields.";

      this._cdr.detectChanges();

      return;
    }

    this.isSaving = true;

    const value = this.footerForm.getRawValue();

    const data: IFooter = {
      newsletterTitle: value.newsletterTitle,

      newsletterDescription: value.newsletterDescription,

      newsletterNote: value.newsletterNote,

      brandName: value.brandName,

      brandDescription: value.brandDescription,

      instagram: value.instagram,

      tiktok: value.tiktok,

      twitter: value.twitter,

      youtube: value.youtube,

      shopLinks: value.shopLinks,

      brandLinks: value.brandLinks,

      supportLinks: value.supportLinks,

      shippingBadgeNumber: value.shippingBadgeNumber,

      shippingBadgeTitle: value.shippingBadgeTitle,

      shippingBadgeText: value.shippingBadgeText,

      copyrightText: value.copyrightText,

      rightsText: value.rightsText,

      privacyLink: value.privacyLink,

      privacyLabel: value.privacyLabel,

      termsLink: value.termsLink,

      termsLabel: value.termsLabel,

      isActive: value.isActive,
    };

    this.footerService.updateFooter(data).subscribe({
      next: (footer) => {
        this.footer = footer;

        this.successMessage = "Footer updated successfully.";

        this.isSaving = false;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Footer update error:", err);

        this.errorMessage = err?.error?.message || "Failed to update footer.";

        this.isSaving = false;

        this._cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/dashboard/myWebsite"]);
  }
}
