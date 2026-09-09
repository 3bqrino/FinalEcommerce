import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { IAbout } from "../models/about.model";

interface AboutResponse {
  data?: {
    about?: IAbout | null;
  };
}

@Injectable({
  providedIn: "root",
})
export class AboutService {
  private apiUrl = `${environment.apiUrl}/home/about`;

  constructor(private http: HttpClient) {}

  private getFileUrl(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    return `${environment.filesUrl}/${value}`;
  }

  private normalize(about: IAbout): IAbout {
    return {
      ...about,
      image: this.getFileUrl(about.image),
      secondaryImage: this.getFileUrl(about.secondaryImage),
      founderImage: this.getFileUrl(about.founderImage),
    };
  }

  getAbout(): Observable<IAbout | null> {
    return this.http.get<AboutResponse>(this.apiUrl).pipe(
      map((res) => {
        const about = res.data?.about;

        if (!about) {
          return null;
        }

        return this.normalize(about);
      }),
    );
  }

  createAbout(data: FormData): Observable<IAbout> {
    return this.http.post<AboutResponse>(this.apiUrl, data).pipe(
      map((res) => {
        const about = res.data?.about;

        if (!about) {
          throw new Error("About information was not returned");
        }

        return this.normalize(about);
      }),
    );
  }

  updateAbout(id: string, data: FormData): Observable<IAbout> {
    return this.http.put<AboutResponse>(`${this.apiUrl}/${id}`, data).pipe(
      map((res) => {
        const about = res.data?.about;

        if (!about) {
          throw new Error("About information was not returned");
        }

        return this.normalize(about);
      }),
    );
  }
}