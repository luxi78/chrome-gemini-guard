import { describe, expect, it } from "vitest";
import { fetchSnapshot, reconcileNow, toggleGuardian } from "../lib/api";

describe("api-contract", () => {
  it("RED: fetchSnapshot returns typed shape once implemented", async () => {
    await expect(fetchSnapshot()).resolves.toMatchObject({
      status: expect.any(String),
      strictMode: expect.any(Boolean),
      autostartEnabled: expect.any(Boolean),
      networkHint: expect.anything()
    });
  });

  it("RED: toggleGuardian command resolves", async () => {
    await expect(toggleGuardian(true)).resolves.toBeUndefined();
  });

  it("RED: reconcileNow command resolves", async () => {
    await expect(reconcileNow()).resolves.toBeUndefined();
  });
});
