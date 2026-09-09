import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Testnomial } from "./testnomial";

describe("Testnomial", () => {
  let component: Testnomial;
  let fixture: ComponentFixture<Testnomial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testnomial],
    }).compileComponents();

    fixture = TestBed.createComponent(Testnomial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
