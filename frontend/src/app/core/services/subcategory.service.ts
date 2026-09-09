import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable, map, tap } from "rxjs";

import { environment } from "../../../environments/environment";

import { ISubcategory } from "../models/subcategory.model";

@Injectable({
  providedIn: "root",
})
export class SubcategoryService {
  private apiUrl = `${environment.apiUrl}/subcategories`;

  private homeApiUrl = `${environment.apiUrl}/home/subcategories`;

  private subcategoriesSubject = new BehaviorSubject<ISubcategory[]>([]);

  subcategories$ = this.subcategoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllSubcategories(): Observable<ISubcategory[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data?.subCategories || []),
      tap((subcategories) => {
        this.subcategoriesSubject.next(subcategories);
      }),
    );
  }

  getHomeSubcategories(): Observable<ISubcategory[]> {
    return this.http
      .get<any>(this.homeApiUrl)
      .pipe(map((res) => res?.data?.subCategories || []));
  }

  getSubcategoryById(id: string): Observable<ISubcategory> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res?.data?.subCategory));
  }

  createSubcategory(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap((res) => {
        const newSubcategory = res?.data?.subCategory;

        if (!newSubcategory) {
          return;
        }

        const current = this.subcategoriesSubject.value;

        this.subcategoriesSubject.next([...current, newSubcategory]);
      }),
    );
  }

  updateSubcategory(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      tap((res) => {
        const updatedSubcategory = res?.data?.subCategory;

        if (!updatedSubcategory) {
          return;
        }

        const updated = this.subcategoriesSubject.value.map((subcategory) =>
          subcategory._id === id ? updatedSubcategory : subcategory,
        );

        this.subcategoriesSubject.next(updated);
      }),
    );
  }

  deleteSubcategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const updated = this.subcategoriesSubject.value.filter(
          (subcategory) => subcategory._id !== id,
        );

        this.subcategoriesSubject.next(updated);
      }),
    );
  }
}
