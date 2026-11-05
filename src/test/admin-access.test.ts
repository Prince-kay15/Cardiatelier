import { describe, expect, it } from "vitest";

import { hasAdminAccess } from "@/lib/admin-access";

describe("dashboard access", () => {
  it("allows only an explicit admin role confirmation", () => {
    expect(hasAdminAccess(true)).toBe(true);
    expect(hasAdminAccess(false)).toBe(false);
    expect(hasAdminAccess(null)).toBe(false);
    expect(hasAdminAccess(undefined)).toBe(false);
    expect(hasAdminAccess("true")).toBe(false);
  });
});