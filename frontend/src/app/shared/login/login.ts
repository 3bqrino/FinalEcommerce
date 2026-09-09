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
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class Login implements OnInit {
  loginForm!: FormGroup;

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

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],

      password: ["", [Validators.required, Validators.minLength(6)]],

      rememberMe: [false],
    });

    this._cdr.detectChanges();
  }

  get email() {
    return this.loginForm.get("email")!;
  }

  get password() {
    return this.loginForm.get("password")!;
  }

  get rememberMe() {
    return this.loginForm.get("rememberMe")!;
  }

  login(): void {
    this.submitted = true;

    this.errorMessage = "";

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this._cdr.detectChanges();

      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this._cdr.detectChanges();

    const loginData = {
      email: String(this.email.value || "")
        .trim()
        .toLowerCase(),

      password: String(this.password.value || ""),

      rememberMe: !!this.rememberMe.value,
    };

    console.log("[LOGIN] Sending request:", {
      email: loginData.email,
      rememberMe: loginData.rememberMe,
    });

    this.authService.login(loginData).subscribe({
      next: (res) => {
        console.log("[LOGIN] Success:", res);

        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");

        this.cartService.mergeGuestCart().subscribe({
          next: () => this.finishLoginRedirect(returnUrl),
          error: (mergeError) => {
            console.error("[LOGIN] Cart merge error:", mergeError);

            this.finishLoginRedirect(returnUrl);
          },
        });
      },

      error: (err) => {
        console.error("[LOGIN] Error:", err);

        this.isSubmitting = false;

        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          "Login failed. Please check your email and password.";

        this._cdr.detectChanges();
      },
    });
  }

  private finishLoginRedirect(returnUrl: string | null): void {
    this.isSubmitting = false;
    this.errorMessage = "";
    this._cdr.detectChanges();

    if (returnUrl && returnUrl.startsWith("/")) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(["/dashboard"]);
      return;
    }

    this.router.navigate(["/home"]);
  }
}
