import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { ICreateAdmin, IUser, IUserHistory } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUser[]> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(map((res) => res?.data?.users || []));
  }

  getUsers(
    params: {
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Observable<{
    users: IUser[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      total: number;
    };
  }> {
    let httpParams = new HttpParams();

    if (params.search?.trim()) {
      httpParams = httpParams.set("search", params.search.trim());
    }

    if (params.page) {
      httpParams = httpParams.set("page", params.page.toString());
    }

    if (params.limit) {
      httpParams = httpParams.set("limit", params.limit.toString());
    }

    httpParams = httpParams.set("sort", "createdAt").set("order", "desc");

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map((res) => ({
        users: res?.data?.users || [],
        pagination: {
          page: res?.data?.pagination?.page || 1,
          limit: res?.data?.pagination?.limit || params.limit || 12,
          totalPages: res?.data?.pagination?.totalPages || 1,
          total: res?.data?.pagination?.total || 0,
        },
      })),
    );
  }

  getUserById(id: string): Observable<IUser> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res?.data?.user));
  }

  deleteUser(id: string): Observable<IUser> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res?.data?.user));
  }

  blockUser(id: string): Observable<IUser> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}/block`, {})
      .pipe(map((res) => res?.data?.user));
  }

  unblockUser(id: string): Observable<IUser> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}/unblock`, {})
      .pipe(map((res) => res?.data?.user));
  }

  createAdmin(data: ICreateAdmin): Observable<IUser> {
    return this.http
      .post<any>(`${this.apiUrl}/admin`, data)
      .pipe(map((res) => res?.data?.admin));
  }

  getUserHistory(id: string): Observable<IUserHistory> {
    return this.http.get<any>(`${this.apiUrl}/${id}/history`).pipe(
      map((res) => ({
        user: res?.data?.user,
        history: res?.data?.history || {
          orders: [],
          refunds: [],
          testimonials: [],
        },
      })),
    );
  }

  getMyProfile(): Observable<IUser> {
    return this.http
      .get<any>(`${this.apiUrl}/me`)
      .pipe(map((res) => res?.data?.user));
  }

  updateMyProfile(data: {
    name?: string;
    phone?: string;
    nationalId?: string;
    gender?: string;
    dateOfBirth?: string | null;
  }): Observable<IUser> {
    return this.http
      .put<any>(`${this.apiUrl}/me`, data)
      .pipe(map((res) => res?.data?.user));
  }

  changeMyPassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/me/password`, {
        currentPassword,
        newPassword,
      })
      .pipe(map((res) => res));
  }

  getAddresses(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/me/addresses`)
      .pipe(map((res) => res?.data?.addresses || []));
  }

  addAddress(data: {
    name: string;
    governorate: string;
    city: string;
    street: string;
    building: string;
  }): Observable<any[]> {
    return this.http
      .post<any>(`${this.apiUrl}/me/addresses`, data)
      .pipe(map((res) => res?.data?.addresses || []));
  }

  updateAddress(
    addressId: string,
    data: {
      name?: string;
      governorate?: string;
      city?: string;
      street?: string;
      building?: string;
    },
  ): Observable<any[]> {
    return this.http
      .put<any>(`${this.apiUrl}/me/addresses/${addressId}`, data)
      .pipe(map((res) => res?.data?.addresses || []));
  }

  deleteAddress(addressId: string): Observable<any[]> {
    return this.http
      .delete<any>(`${this.apiUrl}/me/addresses/${addressId}`)
      .pipe(map((res) => res?.data?.addresses || []));
  }

  setDefaultAddress(addressId: string): Observable<any[]> {
    return this.http
      .put<any>(`${this.apiUrl}/me/addresses/${addressId}/default`, {})
      .pipe(map((res) => res?.data?.addresses || []));
  }
}
