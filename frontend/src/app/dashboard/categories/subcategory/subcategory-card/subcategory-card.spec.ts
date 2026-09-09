import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubcategoryCard } from "./subcategory-card";

describe("SubcategoryCard", () => {
  let component: SubcategoryCard;
  let fixture: ComponentFixture<SubcategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
