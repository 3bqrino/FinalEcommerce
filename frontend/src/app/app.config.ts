import { ApplicationConfig } from "@angular/core";

import { provideRouter, withInMemoryScrolling } from "@angular/router";

import {
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";

import { routes } from "./app.routes";

import { authInterceptor } from "./core/interceptors/auth.interceptor-interceptor";
import { errorInterceptor } from "./core/interceptors/error-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
        anchorScrolling: "enabled",
      }),
    ),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
      ]),
    ),
  ],
};