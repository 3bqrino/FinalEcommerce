import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable, tap } from "rxjs";

import { environment } from "../../../environments/environment";

import { IUser, ILoginReq, ILoginRes, IProfile } from "../models/auth.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userApiUrl = `${environment.apiUrl}/users`;

  private userSubject = new BehaviorSubject<IUser | null>(this.getUser());

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: ILoginReq): Observable<ILoginRes> {
    return this.http
      .post<ILoginRes>(`${this.apiUrl}/login`, data)
      .pipe(tap((res) => this.storeSession(res)));
  }

  signup(data: any): Observable<ILoginRes> {
    return this.http
      .post<ILoginRes>(`${this.apiUrl}/signup`, data)
      .pipe(tap((res) => this.storeSession(res)));
  }

  private storeSession(res: ILoginRes): void {
    const token = res?.accessToken;
    const user = res?.data?.user;

    if (token) {
      localStorage.setItem("token", token);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      this.userSubject.next(user);
    }
  }

  getMyProfile(): Observable<{
    message: string;
    data: { user: IProfile };
  }> {
    return this.http.get<{
      message: string;
      data: { user: IProfile };
    }>(`${this.userApiUrl}/me`);
  }

  updateMyProfile(data: {
    name?: string;
    phone?: string;
    nationalId?: string;
    gender?: "male" | "female";
    dateOfBirth?: string | null;
  }): Observable<{
    message: string;
    data: { user: IProfile };
  }> {
    return this.http
      .put<{
        message: string;
        data: { user: IProfile };
      }>(`${this.userApiUrl}/me`, data)
      .pipe(
        tap((res) => {
          const profile = res?.data?.user;
          if (!profile) return;

          const currentUser = this.userSubject.value;
          const updatedUser: IUser = {
            _id: profile._id,
            name: profile.name,
            email: profile.email,
            role: profile.role || currentUser?.role || "user",
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
          this.userSubject.next(updatedUser);
        }),
      );
  }

  changeMyPassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.put(`${this.userApiUrl}/me/password`, data);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): IUser | null {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token || !rawUser) {
      if (!token) localStorage.removeItem("user");
      return null;
    }

    try {
      return JSON.parse(rawUser) as IUser;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.userSubject.value?.role === "admin";
  }
}
