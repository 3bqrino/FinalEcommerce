import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TestimonialCard } from "./testimonial-card";

describe("TestimonialCard", () => {
  let component: TestimonialCard;
  let fixture: ComponentFixture<TestimonialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
