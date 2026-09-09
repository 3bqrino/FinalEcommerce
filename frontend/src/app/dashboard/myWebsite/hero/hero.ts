import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { HeroService } from '../../../core/services/hero.service';
import { IHero } from '../../../core/models/hero.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero implements OnInit {

  hero: IHero | null = null;

  heroes: IHero[] = [];

  isLoading = false;

  errorMessage = '';

  constructor(
    private heroService: HeroService,
    private router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.heroService
      .getHeroes()
      .subscribe({
        next: (heroes) => {
          this.heroes = heroes;
          this.hero = heroes[0] || null;
          this.isLoading = false;

          this._cdr.detectChanges();
        },

        error: (err) => {
          this.heroes = [];
          this.hero = null;
          this.isLoading = false;

          this.errorMessage =
            err?.error?.message ||
            'Failed to load heroes';

          this._cdr.detectChanges();
        }
      });
  }

  addHero(): void {
    this.router.navigate([
      '/dashboard/myWebsite/hero/add'
    ]);
  }

  editHero(id: string): void {
    this.router.navigate([
      '/dashboard/myWebsite/hero',
      id,
      'edit'
    ]);
  }

  get activeHeroesCount(): number {
    return this.heroes.filter(
      hero => hero.isActive
    ).length;
  }

  get inactiveHeroesCount(): number {
    return this.heroes.filter(
      hero => !hero.isActive
    ).length;
  }
}