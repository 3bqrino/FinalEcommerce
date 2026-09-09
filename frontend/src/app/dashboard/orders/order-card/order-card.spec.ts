import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderCard } from "./order-card";

describe("OrderCard", () => {
  let component: OrderCard;
  let fixture: ComponentFixture<OrderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCard],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
