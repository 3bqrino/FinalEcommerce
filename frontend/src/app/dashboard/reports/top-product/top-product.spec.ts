import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TopProduct } from "./top-product";

describe("TopProduct", () => {
  let component: TopProduct;
  let fixture: ComponentFixture<TopProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(TopProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
