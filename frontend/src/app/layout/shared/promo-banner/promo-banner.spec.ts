import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PromoBanner } from "./promo-banner";

describe("PromoBanner", () => {
  let component: PromoBanner;
  let fixture: ComponentFixture<PromoBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(PromoBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
