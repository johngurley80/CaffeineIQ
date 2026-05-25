import { describe, expect, it } from "vitest";
import { classifyDebt, getSleepDebt } from "@/lib/sleep";

describe("sleep", () => {
  it("adds only positive sleep debt", () => {
    expect(getSleepDebt([8, 7, 6, 9, 8, 5, Number.NaN], 8)).toBe(14);
  });

  it("classifies sleep debt tone", () => {
    expect(classifyDebt(1.9)).toBe("ok");
    expect(classifyDebt(2)).toBe("warning");
    expect(classifyDebt(5)).toBe("warning");
    expect(classifyDebt(5.1)).toBe("danger");
  });
});
