import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LandingScreen from '../../app/(tabs)/LandingScreen';
import { Linking } from 'react-native';

// Create a mockRouter object outside to spy on
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn()
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn()
}));

describe('LandingScreen Rendering and Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset calls between tests
  });

  it('renders branding title and subtitle', () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText('Welcome to Pet Finder!')).toBeTruthy();
    expect(getByText('Find your perfect pet today')).toBeTruthy();
  });

  it('renders main logo and call-to-action button', () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText('Join Us!')).toBeTruthy();
  });

  it('navigates to LoginScreen when Join Us! is pressed', () => {
    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('Join Us!'));
    expect(mockRouter.push).toHaveBeenCalledWith('/LoginScreen');
  });

  it('navigates to LoginScreen when Log In button is pressed', () => {
    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('Log In'));
    expect(mockRouter.push).toHaveBeenCalledWith('/LoginScreen');
  });

  it('navigates to LoginScreen when Sign Up button is pressed', () => {
    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText('Sign Up'));
    expect(mockRouter.push).toHaveBeenCalledWith('/LoginScreen');
  });

  it('renders footer links and opens URL on press', () => {
    const { getByText } = render(<LandingScreen />);
    const contactLink = getByText('Contact Us');
    fireEvent.press(contactLink);
    expect(Linking.openURL).toHaveBeenCalled();
  });

  it('renders without crashing and layout completes', () => {
    const screen = render(<LandingScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });
});
