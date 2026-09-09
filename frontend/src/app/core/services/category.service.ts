import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable, map, tap } from "rxjs";

import { environment } from "../../../environments/environment";

import { ICategory } from "../models/category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  private homeApiUrl = `${environment.apiUrl}/home/categories`;

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);

  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<ICategory[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data?.categories || []),
      tap((categories) => {
        this.categoriesSubject.next(categories);
      }),
    );
  }

  getHomeCategories(): Observable<ICategory[]> {
    return this.http.get<any>(this.homeApiUrl).pipe(
      map((res) => {
        const categories = res?.data?.categories || [];

        return categories.map((category: ICategory) => {
          return {
            ...category,
            image: category.image ? this.getImageUrl(category.image) : null,
          };
        });
      }),
      tap((categories) => {
        this.categoriesSubject.next(categories);
      }),
    );
  }

  getCategoryById(id: string): Observable<ICategory> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res?.data?.category));
  }

  getCategoryBySlug(slug: string): Observable<ICategory> {
    return this.http
      .get<any>(`${this.apiUrl}/slug/${slug}`)
      .pipe(map((res) => res?.data?.category));
  }

  createCategory(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap((res) => {
        const newCategory = res?.data?.category;

        if (!newCategory) {
          return;
        }

        const currentCategories = this.categoriesSubject.value;

        this.categoriesSubject.next([...currentCategories, newCategory]);
      }),
    );
  }

  updateCategory(id: string, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      tap((res) => {
        const updatedCategory = res?.data?.category;

        if (!updatedCategory) {
          return;
        }

        const currentCategories = this.categoriesSubject.value;

        const updatedCategories = currentCategories.map((category) =>
          category._id === id ? updatedCategory : category,
        );

        this.categoriesSubject.next(updatedCategories);
      }),
    );
  }

  toggleCategoryActive(id: string, isActive: boolean): Observable<ICategory> {
    const formData = new FormData();

    formData.append("isActive", String(isActive));

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      map((res) => res?.data?.category),
      tap((updatedCategory) => {
        const updatedCategories = this.categoriesSubject.value.map(
          (category) => (category._id === id ? updatedCategory : category),
        );

        this.categoriesSubject.next(updatedCategories);
      }),
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value;

        const updatedCategories = currentCategories.filter(
          (category) => category._id !== id,
        );

        this.categoriesSubject.next(updatedCategories);
      }),
    );
  }

  private getImageUrl(image: string): string {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${environment.filesUrl}/${image}`;
  }
}
