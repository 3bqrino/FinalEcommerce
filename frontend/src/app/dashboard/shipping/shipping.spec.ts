import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Shipping } from "./shipping";

describe("Shipping", () => {
  let component: Shipping;
  let fixture: ComponentFixture<Shipping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shipping],
    }).compileComponents();

    fixture = TestBed.createComponent(Shipping);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
