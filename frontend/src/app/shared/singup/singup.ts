import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router, RouterLink } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

import { CartService } from "../../core/services/cart.service";

@Component({
  selector: "app-signup",
  standalone: true,

  imports: [ReactiveFormsModule, RouterLink],

  templateUrl: "./singup.html",
  styleUrl: "./singup.css",
})
export class Signup implements OnInit {
  signupForm!: FormGroup;

  submitted = false;
  isSubmitting = false;

  errorMessage = "";

  returnUrl = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get("returnUrl") || "";

    this.signupForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],

      email: ["", [Validators.required, Validators.email]],

      password: ["", [Validators.required, Validators.minLength(6)]],

      phone: [
        "",
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],

      nationalId: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]{14}$/)],
      ],

      gender: ["", [Validators.required]],

      terms: [false, [Validators.requiredTrue]],
    });
  }

  get name() {
    return this.signupForm.get("name")!;
  }

  get email() {
    return this.signupForm.get("email")!;
  }

  get password() {
    return this.signupForm.get("password")!;
  }

  get phone() {
    return this.signupForm.get("phone")!;
  }

  get nationalId() {
    return this.signupForm.get("nationalId")!;
  }

  get gender() {
    return this.signupForm.get("gender")!;
  }

  get terms() {
    return this.signupForm.get("terms")!;
  }

  signup(): void {
    this.submitted = true;

    this.errorMessage = "";

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      this._cdr.detectChanges();

      return;
    }

    this.isSubmitting = true;

    this._cdr.detectChanges();

    const signupData = {
      name: this.name.value.trim(),
      email: this.email.value.trim(),
      password: this.password.value,
      phone: this.phone.value.trim(),
      nationalId: this.nationalId.value.trim(),
      gender: this.gender.value,
    };

    this.authService.signup(signupData).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");

        this.cartService.mergeGuestCart().subscribe({
          next: () => this.finishSignupRedirect(returnUrl),
          error: (mergeError) => {
            console.error("[SIGNUP] Cart merge error:", mergeError);
            this.finishSignupRedirect(returnUrl);
          },
        });
      },

      error: (err) => {
        this.isSubmitting = false;

        this.errorMessage =
          err?.error?.message || "Failed to create account. Please try again.";

        this._cdr.detectChanges();
      },
    });
  }

  private finishSignupRedirect(returnUrl: string | null): void {
    this.isSubmitting = false;
    this.errorMessage = "";
    this._cdr.detectChanges();

    if (returnUrl && returnUrl.startsWith("/")) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    this.router.navigate(["/home"]);
  }
}
