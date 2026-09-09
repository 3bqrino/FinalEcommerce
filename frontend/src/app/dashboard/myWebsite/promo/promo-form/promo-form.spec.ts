import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PromoForm } from "./promo-form";

describe("PromoForm", () => {
  let component: PromoForm;
  let fixture: ComponentFixture<PromoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PromoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
