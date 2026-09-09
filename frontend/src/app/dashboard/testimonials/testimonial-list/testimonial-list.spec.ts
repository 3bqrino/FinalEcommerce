import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TestimonialList } from "./testimonial-list";

describe("TestimonialList", () => {
  let component: TestimonialList;
  let fixture: ComponentFixture<TestimonialList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialList],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
