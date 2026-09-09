import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RefundDetails } from "./refund-details";

describe("RefundDetails", () => {
  let component: RefundDetails;
  let fixture: ComponentFixture<RefundDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
