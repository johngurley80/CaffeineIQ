import { describe, expect, it } from "vitest";
import { getCutoffTime, getDailyLimit, getDecayCurve } from "@/lib/caffeine";

describe("caffeine", () => {
  it("calculates age-adjusted daily limits", () => {
    expect(getDailyLimit(72, "25-34", false)).toBe(400);
    expect(getDailyLimit(60, "55+", false)).toBe(270);
    expect(getDailyLimit(90, "18-24", false)).toBe(400);
  });

  it("caps pregnancy or breastfeeding at 200mg", () => {
    expect(getDailyLimit(90, "18-24", true)).toBe(200);
  });

  it("calculates cut-off time from bedtime and dose", () => {
    expect(getCutoffTime("14:00", 200, "23:00")).toBe("1:00 PM");
    expect(getCutoffTime("09:00", 50, "22:30")).toBe("10:30 PM");
  });

  it("wraps cut-off across midnight", () => {
    expect(getCutoffTime("14:00", 200, "03:00")).toBe("5:00 PM");
  });

  it("returns caffeine decay samples", () => {
    const curve = getDecayCurve(600, 200, 600, 900, 2);
    expect(curve).toHaveLength(3);
    expect(curve[0]).toEqual([600, 200]);
    expect(curve[2][1]).toBeCloseTo(100);
  });

  it("uses a minimum plotting span", () => {
    const curve = getDecayCurve(600, 100, 600, 610, 1);
    expect(curve[1][0]).toBe(660);
  });
});
