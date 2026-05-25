import { describe, expect, it } from "vitest";
import { composeInsight } from "@/lib/insights";

describe("insights", () => {
  it("prioritises hydration deficits", () => {
    expect(composeInsight({ debt: 1, waterDeficit: 0.8 })).toContain("800ml");
  });

  it("describes stable recovery", () => {
    expect(composeInsight({ debt: 1, waterDeficit: 0.2 })).toContain("well-rested");
  });

  it("describes moderate sleep debt", () => {
    expect(composeInsight({ debt: 3, waterDeficit: 0 })).toContain("affecting");
  });

  it("describes high sleep debt", () => {
    expect(composeInsight({ debt: 6, waterDeficit: 0 })).toContain("High sleep debt");
  });
});
