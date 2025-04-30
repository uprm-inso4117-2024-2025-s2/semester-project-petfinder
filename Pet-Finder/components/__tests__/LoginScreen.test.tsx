import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../app/(tabs)/LoginScreen";
import { supabase } from "../../lib/supabase.js";

// Mock the expo-router router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

// Mock supabase methods
jest.mock("../../lib/supabase.js", () => {
  const mockSingle = jest.fn(() =>
    Promise.resolve({
      data: { two_factor_enabled: false }
    })
  );

  return {
    supabase: {
      auth: {
        signInWithPassword: jest.fn(() =>
          Promise.resolve({
            data: { user: { id: 1 } },
            error: null
          })
        )
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: mockSingle
          }))
        }))
      })),
      rpc: jest.fn()
    }
  };
});

describe("LoginScreen Input Validation", () => {
  it("renders email and password fields and login button", () => {
    const { getByLabelText, getByRole } = render(<LoginScreen />);
    expect(getByLabelText("Email input")).toBeTruthy();
    expect(getByLabelText("Password input")).toBeTruthy();
    expect(getByRole("button")).toBeTruthy();
  });

  it("shows error if email is empty", async () => {
    const { getByRole, getByText } = render(<LoginScreen />);
    fireEvent.press(getByRole("button"));
    await waitFor(() => {
      expect(getByText("Email is required")).toBeTruthy();
    });
  });

  it("shows error if password is empty", async () => {
    const { getByLabelText, getByRole, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByLabelText("Email input"), "test@email.com");
    fireEvent.press(getByRole("button"));
    await waitFor(() => {
      expect(getByText("Password is required")).toBeTruthy();
    });
  });

  it("calls signInWithPassword with valid input", async () => {
    const { getByLabelText, getByRole } = render(<LoginScreen />);
    fireEvent.changeText(getByLabelText("Email input"), "test@email.com");
    fireEvent.changeText(getByLabelText("Password input"), "12345678");
    fireEvent.press(getByRole("button"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "12345678"
      });
    });
  });
});
