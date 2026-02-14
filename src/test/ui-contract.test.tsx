import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dashboard } from "../app/dashboard";

describe("ui-contract", () => {
  it("renders dashboard sections with baseline snapshot", () => {
    render(
      <Dashboard
        snapshot={{
          status: "idle",
          strictMode: false,
          autostartEnabled: true,
          networkHint: "Unknown"
        }}
        events={[{ at: "t0", level: "info", message: "boot" }]}
      />
    );

    expect(screen.getByText("Chrome Gemini Guard")).toBeInTheDocument();
    expect(screen.getByTestId("status-value")).toHaveTextContent("idle");
    expect(screen.getByTestId("rules-country")).toHaveTextContent("country => us");
    expect(screen.getByTestId("event-list")).toBeInTheDocument();
    expect(screen.getByTestId("autostart-value")).toHaveTextContent("true");
  });
});
