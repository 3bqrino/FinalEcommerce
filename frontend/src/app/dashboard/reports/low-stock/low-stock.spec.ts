import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LowStock } from "./low-stock";

describe("LowStock", () => {
  let component: LowStock;
  let fixture: ComponentFixture<LowStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowStock],
    }).compileComponents();

    fixture = TestBed.createComponent(LowStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
