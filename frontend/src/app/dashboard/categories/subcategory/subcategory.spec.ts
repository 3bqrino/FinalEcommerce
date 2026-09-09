import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Subcategory } from "./subcategory";

describe("Subcategory", () => {
  let component: Subcategory;
  let fixture: ComponentFixture<Subcategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subcategory],
    }).compileComponents();

    fixture = TestBed.createComponent(Subcategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
