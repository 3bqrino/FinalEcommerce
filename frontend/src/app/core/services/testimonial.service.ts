import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map, tap } from "rxjs";

import { environment } from "../../../environments/environment";
import { ITestimonial } from "../models/testimonial.model";

@Injectable({
  providedIn: "root",
})
export class TestimonialService {
  private apiUrl = `${environment.apiUrl}/testimonials`;

  private testimonialsSubject = new BehaviorSubject<ITestimonial[]>([]);

  testimonials$ = this.testimonialsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTestimonials(): Observable<ITestimonial[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data?.testimonials || []),
      tap((testimonials) => {
        this.testimonialsSubject.next(testimonials);
      }),
    );
  }

  getAdminTestimonials(): Observable<ITestimonial[]> {
    return this.http.get<any>(`${this.apiUrl}/admin`).pipe(
      map((res) => res?.data?.testimonials || []),
      tap((testimonials) => {
        this.testimonialsSubject.next(testimonials);
      }),
    );
  }

  acceptTestimonial(id: string): Observable<ITestimonial> {
    return this.http.put<any>(`${this.apiUrl}/admin/${id}/accept`, {}).pipe(
      map((res) => res?.data?.testimonial),
      tap((updatedTestimonial) => {
        this.updateTestimonial(updatedTestimonial);
      }),
    );
  }

  rejectTestimonial(id: string): Observable<ITestimonial> {
    return this.http.put<any>(`${this.apiUrl}/admin/${id}/reject`, {}).pipe(
      map((res) => res?.data?.testimonial),
      tap((updatedTestimonial) => {
        this.updateTestimonial(updatedTestimonial);
      }),
    );
  }

  deleteTestimonial(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/${id}`).pipe(
      tap(() => {
        const updated = this.testimonialsSubject.value.filter(
          (item) => item._id !== id,
        );

        this.testimonialsSubject.next(updated);
      }),
    );
  }

  createTestimonial(comment: string, rating: number): Observable<ITestimonial> {
    return this.http
      .post<any>(this.apiUrl, {
        comment,
        rating,
      })
      .pipe(
        map((res) => res?.data?.testimonial),
        tap((testimonial) => {
          if (!testimonial) {
            return;
          }

          this.testimonialsSubject.next([
            ...this.testimonialsSubject.value,
            testimonial,
          ]);
        }),
      );
  }

  private updateTestimonial(testimonial: ITestimonial): void {
    if (!testimonial) {
      return;
    }

    const updated = this.testimonialsSubject.value.map((item) =>
      item._id === testimonial._id ? testimonial : item,
    );

    this.testimonialsSubject.next(updated);
  }
}
