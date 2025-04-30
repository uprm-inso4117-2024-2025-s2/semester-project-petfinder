import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LandingScreen from '../app/(tabs)/LandingScreen';
import { useRouter } from "expo-router";

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter; // No TypeScript casting here

describe("LandingScreen", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: mockPush });
    mockPush.mockClear();
  });

  it("renders the title and subtitle", () => {
    const { getByText } = render(<LandingScreen />);
    
    expect(getByText("Welcome to Pet Finder!")).toBeTruthy();
    expect(getByText("Find your perfect pet today")).toBeTruthy();
  });

  it("navigates to LoginScreen when Log In button is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    const loginButton = getByText("Log In");
    fireEvent.press(loginButton);
    expect(mockPush).toHaveBeenCalledWith("/LoginScreen");
  });

  it("navigates to SignUp when Sign Up button is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    const signUpButton = getByText("Sign Up");
    fireEvent.press(signUpButton);
    expect(mockPush).toHaveBeenCalledWith("/SignUp");
  });

  it("navigates to LoginScreen when Join Us button is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    const joinUsButton = getByText("Join Us!");
    fireEvent.press(joinUsButton);
    expect(mockPush).toHaveBeenCalledWith("/LoginScreen");
  });

  it("renders all success stories", () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText(/After a week of searching, we found Luna/i)).toBeTruthy();
    expect(getByText(/We thought Max was gone forever/i)).toBeTruthy();
    expect(getByText(/Coco ran off during a storm/i)).toBeTruthy();
    expect(getByText(/finding Toby again/i)).toBeTruthy();
    expect(getByText(/Bruno was missing for 3 days/i)).toBeTruthy();
  });
});
