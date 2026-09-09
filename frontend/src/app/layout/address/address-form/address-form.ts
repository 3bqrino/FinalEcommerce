import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";

import { AddressService } from "../../../core/services/address.service";

import { IAddress } from "../../../core/models/address.model";

@Component({
  selector: "app-address-form",
  standalone: true,

  imports: [ReactiveFormsModule],

  templateUrl: "./address-form.html",
  styleUrl: "./address-form.css",
})
export class AddressForm implements OnInit {
  addressId: string | null = null;

  isEditMode = false;

  addressForm!: FormGroup;

  submitted = false;

  isSubmitting = false;

  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.addressId = this.route.snapshot.paramMap.get("addressId");

    this.isEditMode = !!this.addressId;

    if (this.isEditMode && this.addressId) {
      this.getAddress();
    }
  }

  private createForm(): void {
    this.addressForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],

      governorate: ["", [Validators.required]],

      city: ["", [Validators.required]],

      street: ["", [Validators.required]],

      building: ["", [Validators.required]],

      isDefault: [false],
    });
  }

  get name() {
    return this.addressForm.get("name")!;
  }

  get governorate() {
    return this.addressForm.get("governorate")!;
  }

  get city() {
    return this.addressForm.get("city")!;
  }

  get street() {
    return this.addressForm.get("street")!;
  }

  get building() {
    return this.addressForm.get("building")!;
  }

  get isDefault() {
    return this.addressForm.get("isDefault")!;
  }

  getAddress(): void {
    this.addressService.getAddresses().subscribe({
      next: (addresses) => {
        const address = addresses.find((item) => item._id === this.addressId);

        if (!address) {
          this.errorMessage = "Address not found.";

          this._cdr.detectChanges();

          return;
        }

        this.addressForm.patchValue({
          name: address.name,

          governorate: address.governorate,

          city: address.city,

          street: address.street,

          building: address.building,

          isDefault: address.isDefault,
        });

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Failed to load address:", err);

        this.errorMessage = err?.error?.message || "Failed to load address.";

        this._cdr.detectChanges();
      },
    });
  }

  saveAddress(): void {
    this.submitted = true;

    this.errorMessage = "";

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();

      this._cdr.detectChanges();

      return;
    }

    this.isSubmitting = true;

    this._cdr.detectChanges();

    const formValue = this.addressForm.getRawValue();

    const address: IAddress = {
      name: formValue.name.trim(),

      governorate: formValue.governorate.trim(),

      city: formValue.city.trim(),

      street: formValue.street.trim(),

      building: formValue.building.trim(),

      isDefault: formValue.isDefault,
    };

    if (this.isEditMode && this.addressId) {
      this.addressService.updateAddress(this.addressId, address).subscribe({
        next: () => {
          this.isSubmitting = false;

          this.router.navigate(["/addresses"]);

          this._cdr.detectChanges();
        },

        error: (err) => {
          console.error("Update address error:", err);

          this.isSubmitting = false;

          this.errorMessage =
            err?.error?.message || "Failed to update address.";

          this._cdr.detectChanges();
        },
      });

      return;
    }

    this.addressService.addAddress(address).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.router.navigate(["/addresses"]);

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.error("Add address error:", err);

        this.isSubmitting = false;

        this.errorMessage = err?.error?.message || "Failed to add address.";

        this._cdr.detectChanges();
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/addresses"]);
  }
}
