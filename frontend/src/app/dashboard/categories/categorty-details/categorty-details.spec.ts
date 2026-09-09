import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CategortyDetails } from "./categorty-details";

describe("CategortyDetails", () => {
  let component: CategortyDetails;
  let fixture: ComponentFixture<CategortyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategortyDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(CategortyDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
