import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StickyCart } from "./sticky-cart";

describe("StickyCart", () => {
  let component: StickyCart;
  let fixture: ComponentFixture<StickyCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickyCart],
    }).compileComponents();

    fixture = TestBed.createComponent(StickyCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
