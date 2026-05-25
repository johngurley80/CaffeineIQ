import { describe, expect, it } from "vitest";
import { getWaterDeficit, getWaterTarget } from "@/lib/hydration";

describe("hydration", () => {
  it("calculates water target from weight and caffeine drinks", () => {
    expect(getWaterTarget(70, 3)).toBe(2.8);
  });

  it("calculates remaining deficit", () => {
    expect(getWaterDeficit(1.2, 2.8)).toBeCloseTo(1.6);
    expect(getWaterDeficit(3, 2.8)).toBe(0);
  });
});
