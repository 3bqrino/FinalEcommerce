import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RefundCard } from "./refund-card";

describe("RefundCard", () => {
  let component: RefundCard;
  let fixture: ComponentFixture<RefundCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
