import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OverviewCard } from "./overview-card";

describe("OverviewCard", () => {
  let component: OverviewCard;
  let fixture: ComponentFixture<OverviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewCard],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
