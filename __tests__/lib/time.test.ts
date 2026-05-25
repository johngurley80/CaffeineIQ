import { describe, expect, it } from "vitest";
import { formatClock24, minutesToTime, timeToMinutes } from "@/lib/time";

describe("time", () => {
  it("parses 24h time", () => {
    expect(timeToMinutes("09:30")).toBe(570);
  });

  it("formats 12h time and wraps days", () => {
    expect(minutesToTime(0)).toBe("12:00 AM");
    expect(minutesToTime(780)).toBe("1:00 PM");
    expect(minutesToTime(-30)).toBe("11:30 PM");
  });

  it("formats 24h time and wraps days", () => {
    expect(formatClock24(75)).toBe("01:15");
    expect(formatClock24(1445)).toBe("00:05");
  });
});
