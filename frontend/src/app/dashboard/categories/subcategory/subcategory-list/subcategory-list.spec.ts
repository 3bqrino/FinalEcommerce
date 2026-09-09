import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubcategoryList } from "./subcategory-list";

describe("SubcategoryList", () => {
  let component: SubcategoryList;
  let fixture: ComponentFixture<SubcategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryList],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
