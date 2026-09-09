import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HeroService } from "../../../core/services/hero.service";
import { PromoService } from "../../../core/services/promo.service";
import { AboutService } from "../../../core/services/about.service";
import { FooterService } from "../../../core/services/footer.service";
import { IHero } from "../../../core/models/hero.model";
import { IPromo } from "../../../core/models/promo.model";
import { IAbout } from "../../../core/models/about.model";
import { IFooter } from "../../../core/models/footer.model";

@Component({
  selector: "app-homepage",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./homepage.html",
  styleUrl: "./homepage.css",
})
export class Homepage implements OnInit {
  hero: IHero | null = null;
  promo: IPromo | null = null;
  about: IAbout | null = null;
  footer: IFooter | null = null;

  heroError = false;
  promoError = false;
  aboutError = false;
  footerError = false;

  constructor(
    private heroService: HeroService,
    private promoService: PromoService,
    private aboutService: AboutService,
    private footerService: FooterService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadHomepage();
  }

  loadHomepage(): void {
    this.loadHero();
    this.loadPromo();
    this.loadAbout();
    this.loadFooter();
  }

  loadHero(): void {
    this.heroService.getHomeHeroes().subscribe({
      next: (heroes) => {
        this.hero = heroes.length > 0 ? heroes[0] : null;
        this.heroError = false;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Homepage hero error:", err);

        this.hero = null;
        this.heroError = true;

        this._cdr.detectChanges();
      },
    });
  }

  loadPromo(): void {
    this.promoService.getPromo().subscribe({
      next: (promo) => {
        this.promo = promo;
        this.promoError = false;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Homepage promo error:", err);

        this.promo = null;
        this.promoError = true;

        this._cdr.detectChanges();
      },
    });
  }

  loadAbout(): void {
    this.aboutService.getAbout().subscribe({
      next: (about) => {
        this.about = about;
        this.aboutError = false;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Homepage about error:", err);

        this.about = null;
        this.aboutError = true;

        this._cdr.detectChanges();
      },
    });
  }

  loadFooter(): void {
    this.footerService.getFooter().subscribe({
      next: (footer) => {
        this.footer = footer;
        this.footerError = false;

        this._cdr.detectChanges();
      },

      error: (err) => {
        console.log("Homepage footer error:", err);

        this.footer = null;
        this.footerError = true;

        this._cdr.detectChanges();
      },
    });
  }
}