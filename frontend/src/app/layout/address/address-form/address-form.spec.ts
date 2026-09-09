import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddressForm } from "./address-form";

describe("AddressForm", () => {
  let component: AddressForm;
  let fixture: ComponentFixture<AddressForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
