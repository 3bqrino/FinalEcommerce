import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RefundList } from "./refund-list";

describe("RefundList", () => {
  let component: RefundList;
  let fixture: ComponentFixture<RefundList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundList],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
