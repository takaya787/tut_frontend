import React from "react";
// Using render and screen from test-utils.tsx instead of
// @testing-library/react
import { render, screen, waitFor } from "../test-utils";
import Home from "../../pages/index";

describe("Home", () => {
  describe("not login", () => {
    it("prevent not wrapped in act(...) warning", () => {
      render(<Home />);
      expect(screen.getByText("Sample App")).toBeInTheDocument();
    });

    it("show welcome text", () => {
      render(<Home />);
      expect(screen.getByText("Welcome to the Sample App")).toBeInTheDocument();
    });

    it("has 2 signup buttons", () => {
      render(<Home />);
      const signup_buttons = screen.getAllByRole("button");
      expect(signup_buttons).toHaveLength(2);
    });
  });
});
