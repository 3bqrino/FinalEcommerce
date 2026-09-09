import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TestimonialAction } from "./testimonial-action";

describe("TestimonialAction", () => {
  let component: TestimonialAction;
  let fixture: ComponentFixture<TestimonialAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialAction],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialAction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
