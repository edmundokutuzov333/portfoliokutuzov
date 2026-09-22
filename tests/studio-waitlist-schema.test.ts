import { describe, expect, it } from "vitest";
import { studioWaitlistEmailSchema } from "@/lib/studio/waitlist-schema";

describe("studio waitlist email schema", () => {
  it("rejects an invalid email", () => {
    expect(() => studioWaitlistEmailSchema.parse({ email: "not-an-email" })).toThrow();
  });

  it("normalizes a valid email", () => {
    expect(studioWaitlistEmailSchema.parse({ email: " TEST@EMAIL.COM " })).toEqual({
      email: "test@email.com",
    });
  });
});
