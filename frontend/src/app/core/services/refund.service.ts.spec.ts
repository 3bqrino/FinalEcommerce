import { TestBed } from "@angular/core/testing";

import { RefundServiceTs } from "./refund.service.ts";

describe("RefundServiceTs", () => {
  let service: RefundServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefundServiceTs);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
