import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Refund } from "./refund";

describe("Refund", () => {
  let component: Refund;
  let fixture: ComponentFixture<Refund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Refund],
    }).compileComponents();

    fixture = TestBed.createComponent(Refund);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
