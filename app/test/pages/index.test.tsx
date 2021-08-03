import React from "react";
// Using render and screen from test-utils.tsx instead of
// @testing-library/react
import { render, screen } from "../test-utils";
import Home from "../../pages/index";

// describe("Home", () => {
//   it("should contain title", () => {
//     render(<Home />);

//     const heading = screen.getByText(/Testing Next.js With Jest and React Testing Library/i);

//     // we can only use toBeInTheDocument because it was imported
//     // in the jest.setup.js and configured in jest.config.js
//     expect(heading).toBeInTheDocument();
//   });
// });
test("Header contains correct text", () => {
  render(<Home />);
  const text = screen.getByText("My React and TypeScript App");
  expect(text).toBeInTheDocument();
});
