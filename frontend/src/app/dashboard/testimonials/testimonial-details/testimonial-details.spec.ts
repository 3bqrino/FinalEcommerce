import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TestimonialDetails } from "./testimonial-details";

describe("TestimonialDetails", () => {
  let component: TestimonialDetails;
  let fixture: ComponentFixture<TestimonialDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
