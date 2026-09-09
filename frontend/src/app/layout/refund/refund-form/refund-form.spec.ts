import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RefundForm } from "./refund-form";

describe("RefundForm", () => {
  let component: RefundForm;
  let fixture: ComponentFixture<RefundForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
