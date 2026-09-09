import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { IProduct } from "../models/product.model";

export interface IProductPagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface IAdminProductsResponse {
  products: IProduct[];
  pagination: IProductPagination;
}

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  private productsSubject = new BehaviorSubject<IProduct[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private normalizeProduct(product: IProduct): IProduct {
    return {
      ...product,
      image: this.getImageUrl(product.image),
    };
  }

  private normalizeProducts(products: IProduct[]): IProduct[] {
    return products.map((product) => this.normalizeProduct(product));
  }

  private getImageUrl(image: string): string {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${environment.filesUrl}/${image}`;
  }

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const products =
          res?.data?.products ||
          res?.data?.results ||
          [];

        return this.normalizeProducts(products);
      }),
      tap((products) => {
        this.productsSubject.next(products);
      }),
    );
  }

  getAllProductsForAdmin(
    page: number = 1,
    limit: number = 20,
  ): Observable<IAdminProductsResponse> {
    return this.http
      .get<any>(
        `${this.apiUrl}/admin/all?page=${page}&limit=${limit}`,
      )
      .pipe(
        map((res) => {
          const products = res?.data?.products || [];

          return {
            products: this.normalizeProducts(products),
            pagination: {
              page: res?.data?.pagination?.page ?? page,
              limit: res?.data?.pagination?.limit ?? limit,
              totalPages:
                res?.data?.pagination?.totalPages ?? 1,
              total:
                res?.data?.pagination?.total ??
                products.length,
            },
          };
        }),
        tap((result) => {
          this.productsSubject.next(result.products);
        }),
      );
  }

  getLowStockProducts(): Observable<IProduct[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/low-stock`)
      .pipe(
        map((res) => {
          const products = res?.data?.products || [];
          return this.normalizeProducts(products);
        }),
      );
  }

  getProductById(id: string): Observable<IProduct> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/${id}`)
      .pipe(
        map((res) => {
          const product = res?.data?.product;
          return this.normalizeProduct(product);
        }),
      );
  }

  getProductBySlug(slug: string): Observable<IProduct> {
    return this.http
      .get<any>(`${this.apiUrl}/slug/${slug}`)
      .pipe(
        map((res) => {
          const product = res?.data?.product;
          return this.normalizeProduct(product);
        }),
      );
  }

  getProductsByCategory(slug: string): Observable<IProduct[]> {
    return this.http
      .get<any>(`${this.apiUrl}/category/${slug}`)
      .pipe(
        map((res) => {
          const products = res?.data?.products || [];
          return this.normalizeProducts(products);
        }),
        tap((products) => {
          this.productsSubject.next(products);
        }),
      );
  }

  getRelatedProducts(slug: string): Observable<IProduct[]> {
    return this.http
      .get<any>(`${this.apiUrl}/related/${slug}`)
      .pipe(
        map((res) => {
          const products = res?.data?.products || [];
          return this.normalizeProducts(products);
        }),
      );
  }

  createProduct(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap((res) => {
        const newProduct = res?.data?.product;

        if (!newProduct) {
          return;
        }

        const normalizedProduct =
          this.normalizeProduct(newProduct);

        const currentProducts =
          this.productsSubject.value;

        this.productsSubject.next([
          ...currentProducts,
          normalizedProduct,
        ]);
      }),
    );
  }

  updateProduct(
    id: string,
    data: FormData,
  ): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(
        tap((res) => {
          const updatedProduct = res?.data?.product;

          if (!updatedProduct) {
            return;
          }

          const normalizedProduct =
            this.normalizeProduct(updatedProduct);

          const currentProducts =
            this.productsSubject.value;

          const updatedProducts =
            currentProducts.map((product) =>
              product._id === id
                ? normalizedProduct
                : product,
            );

          this.productsSubject.next(updatedProducts);
        }),
      );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentProducts =
            this.productsSubject.value;

          const updatedProducts =
            currentProducts.filter(
              (product) => product._id !== id,
            );

          this.productsSubject.next(updatedProducts);
        }),
      );
  }
}