import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TopUser } from "./top-user";

describe("TopUser", () => {
  let component: TopUser;
  let fixture: ComponentFixture<TopUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUser],
    }).compileComponents();

    fixture = TestBed.createComponent(TopUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
