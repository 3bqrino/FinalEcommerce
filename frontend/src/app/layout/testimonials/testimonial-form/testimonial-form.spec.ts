import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TestimonialForm } from "./testimonial-form";

describe("TestimonialForm", () => {
  let component: TestimonialForm;
  let fixture: ComponentFixture<TestimonialForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
