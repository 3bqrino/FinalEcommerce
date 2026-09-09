import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";
import { IHero } from "../models/hero.model";

@Injectable({
  providedIn: "root",
})
export class HeroService {
  private apiUrl = `${environment.apiUrl}/home/hero`;

  constructor(private http: HttpClient) {}

  private normalize(hero: IHero): IHero {
    return {
      ...hero,
      image: hero.image ? `${environment.filesUrl}/${hero.image}` : "",
    };
  }

  getHeroes(): Observable<IHero[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const heroes = res?.data?.heroes || [];

        return heroes.map((hero: IHero) => this.normalize(hero));
      }),
    );
  }

  getHeroById(id: string): Observable<IHero> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => this.normalize(res?.data?.hero)));
  }

  getHomeHeroes(): Observable<IHero[]> {
    return this.getHeroes();
  }

  createHero(data: FormData): Observable<IHero> {
    return this.http
      .post<any>(this.apiUrl, data)
      .pipe(map((res) => this.normalize(res?.data?.hero)));
  }

  updateHero(id: string, data: FormData): Observable<IHero> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(map((res) => this.normalize(res?.data?.hero)));
  }

  deleteHero(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
