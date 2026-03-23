import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Home landing page", () => {
  it("renders a CTA to the planner page without embedding the form", async () => {
    const { default: Home } = await import("@/app/page");

    render(<Home />);

    const cta = screen.getByRole("link", { name: /start planning/i });

    expect(cta).toHaveAttribute("href", "/plan");
    expect(screen.queryByLabelText(/where are you leaving from/i)).not.toBeInTheDocument();
    expect(screen.getByText(/journey at a glance/i)).toBeInTheDocument();
  });
});
