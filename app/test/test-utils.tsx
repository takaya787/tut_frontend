import React, { FC, ReactElement } from "react";
import { RecoilRoot } from "recoil";
// test-utils.js
import { render, RenderOptions } from "@testing-library/react";

const Providers: FC = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
