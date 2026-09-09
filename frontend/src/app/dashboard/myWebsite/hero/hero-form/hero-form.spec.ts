import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeroForm } from "./hero-form";

describe("HeroForm", () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
