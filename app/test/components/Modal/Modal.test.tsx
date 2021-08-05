import React from "react";
// Using render and screen from test-utils.tsx instead of
// @testing-library/react
import { render, screen, fireEvent } from "../../test-utils";
import { Modal } from "../../../components/Modal/Modal";

describe("Modal", () => {
  const props = { title: "title" };
  let SignUpButton: HTMLElement;

  // renderを共通処理
  beforeEach(() => {
    render(<Modal title={props.title} />);
    // props.titleの正規表現のbuttonを取得
    SignUpButton = screen.getByRole("button", { name: new RegExp(props.title) });
  });

  describe("initial state", () => {
    it("has props name button", () => {
      expect(screen.getByRole("button", { name: props.title })).toBeInTheDocument();
    });
  });
  describe("when isSignUp state is true,", () => {
    // state変更を共通化
    let username: HTMLElement;
    let email: HTMLElement;
    let password: HTMLElement;
    let password_confirmation: HTMLElement;

    beforeEach(() => {
      fireEvent.click(SignUpButton);
      username = screen.getByLabelText("Your name");
      email = screen.getByLabelText("Email");
      password = screen.getByLabelText("Password");
      password_confirmation = screen.getByLabelText("Password_confirmation");
    });

    it("has SignUp title", () => {
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });

    it("has 4 inputs", () => {
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(password_confirmation).toBeInTheDocument();
    });

    it("has close button and can close modal", () => {
      const closeButton = screen.getByRole("button", { name: /×/ });
      expect(closeButton).toBeInTheDocument();
      // modalを閉じる
      fireEvent.click(closeButton);
      SignUpButton = screen.getByRole("button", { name: new RegExp(props.title) });
      expect(SignUpButton).toBeInTheDocument();
    });
  });
  describe("when isLogin true,", () => {
    beforeEach(async () => {
      fireEvent.click(SignUpButton);
      const LoginButton = await screen.findByRole("button", { name: /Login/ });
      fireEvent.click(LoginButton);
    });

    it("has Login Heading", () => {
      expect(screen.getByRole("heading", { name: /Log in/ })).toBeInTheDocument();
    });

    it("has 4 buttons", () => {
      expect(screen.getAllByRole("button")).toHaveLength(4);
    });

    it("has close button and can close modal", () => {
      const closeButton = screen.getByRole("button", { name: /×/ });
      expect(closeButton).toBeInTheDocument();
      // modalを閉じる
      fireEvent.click(closeButton);
      SignUpButton = screen.getByRole("button", { name: new RegExp(props.title) });
      expect(SignUpButton).toBeInTheDocument();
    });
  });
});
