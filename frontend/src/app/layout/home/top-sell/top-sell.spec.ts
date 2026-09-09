import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TopSell } from "./top-sell";

describe("TopSell", () => {
  let component: TopSell;
  let fixture: ComponentFixture<TopSell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSell],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
