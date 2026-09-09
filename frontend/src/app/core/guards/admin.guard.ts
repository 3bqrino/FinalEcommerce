import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../services/auth.service";

export const adminGuard = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  return router.createUrlTree(["/home"]);
};
