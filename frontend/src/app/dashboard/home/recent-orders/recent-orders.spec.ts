import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecentOrders } from "./recent-orders";

describe("RecentOrders", () => {
  let component: RecentOrders;
  let fixture: ComponentFixture<RecentOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
