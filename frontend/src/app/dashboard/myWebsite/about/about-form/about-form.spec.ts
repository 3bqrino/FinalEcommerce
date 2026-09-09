import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutForm } from "./about-form";

describe("AboutForm", () => {
  let component: AboutForm;
  let fixture: ComponentFixture<AboutForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
