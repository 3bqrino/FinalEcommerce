import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Promo } from "./promo";

describe("Promo", () => {
  let component: Promo;
  let fixture: ComponentFixture<Promo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promo],
    }).compileComponents();

    fixture = TestBed.createComponent(Promo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
