import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { catchError, throwError } from "rxjs";

import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  const authService = inject(AuthService);

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      console.error("[HTTP ERROR]", {
        url: req.url,
        status: error.status,
        message: error?.error?.message,
      });

      if (error.status === 401 && token) {
        authService.logout();
      }

      return throwError(() => error);
    }),
  );
};
