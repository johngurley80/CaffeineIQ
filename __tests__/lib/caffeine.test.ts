import { describe, expect, it } from "vitest";
import { getCutoffTime, getDailyLimit, getDecayCurve, poundsToKg } from "@/lib/caffeine";

describe("caffeine", () => {
  it("calculates weight-based daily limits", () => {
    expect(getDailyLimit(70, false, [])).toBe(399);
    expect(getDailyLimit(80, false, [])).toBe(400);
  });

  it("caps pregnancy or breastfeeding at 200mg", () => {
    expect(getDailyLimit(70, true, [])).toBe(200);
  });

  it("applies health condition caps", () => {
    expect(getDailyLimit(70, false, ["hypertension"])).toBe(200);
    expect(getDailyLimit(70, false, ["anxiety"])).toBe(200);
    expect(getDailyLimit(70, false, ["kidney_disease"])).toBe(150);
    expect(getDailyLimit(70, true, ["kidney_disease"])).toBe(150);
  });

  it("converts pounds to kilograms for the limit formula", () => {
    expect(getDailyLimit(poundsToKg(154), false, [])).toBe(399);
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
