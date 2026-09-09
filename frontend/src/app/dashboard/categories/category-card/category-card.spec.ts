import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CategoryCard } from "./category-card";

describe("CategoryCard", () => {
  let component: CategoryCard;
  let fixture: ComponentFixture<CategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
