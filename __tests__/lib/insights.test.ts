import { describe, expect, it } from "vitest";
import { composeInsight } from "@/lib/insights";

const base = {
  debt: 1,
  waterDeficit: 0.2,
  caffeineConsumed: 0,
  dailyLimit: 400,
  cutoffPassed: false,
};

describe("insights", () => {
  it("prioritises a passed caffeine cut-off", () => {
    expect(composeInsight({ ...base, cutoffPassed: true, debt: 8, caffeineConsumed: 400, waterDeficit: 2 })).toContain("Cut-off");
  });

  it("prioritises high sleep debt after cut-off", () => {
    expect(composeInsight({ ...base, debt: 6, caffeineConsumed: 400, waterDeficit: 2 })).toContain("Five-plus");
  });

  it("warns at 80 percent of the daily caffeine limit", () => {
    expect(composeInsight({ ...base, caffeineConsumed: 320 })).toContain("80%");
  });

  it("prioritises hydration deficits", () => {
    expect(composeInsight({ ...base, waterDeficit: 0.8 })).toContain("behind on water");
  });

  it("describes stable recovery", () => {
    expect(composeInsight(base)).toContain("All signals clear");
  });

  it("describes moderate sleep debt", () => {
    expect(composeInsight({ ...base, debt: 3, waterDeficit: 0 })).toContain("affecting");
  });
});
