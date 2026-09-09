import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

import { RouterLink } from "@angular/router";

import { HeroService } from "../../../core/services/hero.service";
import { IHero } from "../../../core/models/hero.model";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./hero.html",
  styleUrl: "./hero.css",
})
export class Hero implements OnInit, OnDestroy {
  heroes: IHero[] = [];

  currentSlide = 0;

  errorMessage = "";

  private slider?: ReturnType<typeof setInterval>;

  constructor(
    private heroService: HeroService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  getHeroes(): void {
    this.errorMessage = "";

    this.heroService.getHomeHeroes().subscribe({
      next: (heroes) => {
        this.heroes = heroes.filter((hero) => hero.isActive);

        this.currentSlide = 0;

        this.stopSlider();

        if (this.heroes.length > 1) {
          this.startSlider();
        }

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Hero load error:", err);

        this.heroes = [];

        this.errorMessage = err?.error?.message || "Failed to load hero";

        this._cdr.detectChanges();
      },
    });
  }

  nextSlide(): void {
    if (this.heroes.length <= 1) {
      return;
    }

    this.currentSlide = (this.currentSlide + 1) % this.heroes.length;

    this.restartSlider();

    this._cdr.detectChanges();
  }

  previousSlide(): void {
    if (this.heroes.length <= 1) {
      return;
    }

    this.currentSlide =
      (this.currentSlide - 1 + this.heroes.length) % this.heroes.length;

    this.restartSlider();

    this._cdr.detectChanges();
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.heroes.length) {
      return;
    }

    this.currentSlide = index;

    this.restartSlider();

    this._cdr.detectChanges();
  }

  private startSlider(): void {
    this.stopSlider();

    if (this.heroes.length <= 1) {
      return;
    }

    this.slider = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroes.length;

      this._cdr.detectChanges();
    }, 7000);
  }

  private stopSlider(): void {
    if (this.slider) {
      clearInterval(this.slider);

      this.slider = undefined;
    }
  }

  private restartSlider(): void {
    this.startSlider();
  }

  get currentHero(): IHero | null {
    if (!this.heroes.length) {
      return null;
    }

    return this.heroes[this.currentSlide] || this.heroes[0];
  }

  get progress(): number {
    if (!this.heroes.length) {
      return 0;
    }

    return ((this.currentSlide + 1) / this.heroes.length) * 100;
  }

  get currentNumber(): string {
    return String(this.currentSlide + 1).padStart(2, "0");
  }

  get totalNumber(): string {
    return String(this.heroes.length).padStart(2, "0");
  }
}
