import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddressList } from "./address-list";

describe("AddressList", () => {
  let component: AddressList;
  let fixture: ComponentFixture<AddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressList],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
