import { describe, expect, it } from "vitest";

import { hasAdminAccess } from "@/lib/admin-access";

describe("dashboard access", () => {
  it("allows the two approved owner accounts only", () => {
    expect(hasAdminAccess(true, "Princekay043@gmail.com")).toBe(true);
    expect(hasAdminAccess(true, "Cardiatelier1@gmail.com")).toBe(true);
    expect(hasAdminAccess(true, "someone-else@example.com")).toBe(false);
    expect(hasAdminAccess(true, null)).toBe(false);
  });

  it("requires an explicit admin role for an approved owner account", () => {
    expect(hasAdminAccess(false, "princekay043@gmail.com")).toBe(false);
    expect(hasAdminAccess(null, "cardiatelier1@gmail.com")).toBe(false);
    expect(hasAdminAccess("true", "princekay043@gmail.com")).toBe(false);
  });
});