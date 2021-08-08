import React from "react";
// Using render and screen from test-utils.tsx instead of
// @testing-library/react
import { render, screen, waitFor } from "../test-utils";
import Home from "../../pages/index";

describe("Home", () => {
  // useEffect内で状態変更を行うので、componentをawaitでrenderする必要あり
  beforeEach(async () => {
    await waitFor(() => render(<Home />));
  });
  describe("not login", () => {
    it("show welcome text", () => {
      expect(
        screen.getByRole("heading", { name: "Welcome to the Sample App" })
      ).toBeInTheDocument();
      // screen.debug();
    });

    it("has 2 signup buttons", () => {
      const signup_buttons = screen.getAllByRole("button");
      expect(signup_buttons).toHaveLength(2);
    });
  });
  describe("is logined", () => {
    // it("has 2 signup buttons");
  });
});
