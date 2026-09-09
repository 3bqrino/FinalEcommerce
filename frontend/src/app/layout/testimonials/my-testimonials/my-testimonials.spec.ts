import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyTestimonials } from "./my-testimonials";

describe("MyTestimonials", () => {
  let component: MyTestimonials;
  let fixture: ComponentFixture<MyTestimonials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTestimonials],
    }).compileComponents();

    fixture = TestBed.createComponent(MyTestimonials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
