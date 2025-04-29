import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReportScreen from '../app/(tabs)/ReportScreen'; // Adjust this path if needed
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

// --- Mocks ---
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('ReportScreen (Lost/Found Pet Report)', () => {
  let routerReplaceMock: jest.Mock;

  beforeEach(() => {
    routerReplaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      replace: routerReplaceMock,
    });
    jest.clearAllMocks();
  });

  it('renders key components for lost pet report by default', () => {
    const { getByText, getByPlaceholderText } = render(<ReportScreen />);
    // Defaults to lost report so title should be "Report a Lost Pet"
    expect(getByText('Report a Lost Pet')).toBeTruthy();
    // Check for key input fields (Pet Name, Location, etc.)
    expect(getByPlaceholderText('Enter pet name')).toBeTruthy();
    expect(getByPlaceholderText('Enter location')).toBeTruthy();
    expect(getByText('Pick Date and Time')).toBeTruthy();
    expect(getByText('Add Photo')).toBeTruthy();
  });

  it('updates text inputs on user input', () => {
    const { getByPlaceholderText } = render(<ReportScreen />);
    const petNameInput = getByPlaceholderText('Enter pet name');
    const locationInput = getByPlaceholderText('Enter location');

    fireEvent.changeText(petNameInput, 'Buddy');
    fireEvent.changeText(locationInput, 'Central Park');

    expect(petNameInput.props.value).toBe('Buddy');
    expect(locationInput.props.value).toBe('Central Park');
  });

  it('shows alert when required fields are missing on submission', () => {
    const { getByText } = render(<ReportScreen />);
    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('handles image upload placeholder behavior', async () => {
    // Mock permissions and launchImageLibraryAsync responses
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'test-uri' }],
    });

    const { getByText } = render(<ReportScreen />);
    const addPhotoButton = getByText('Add Photo');
    fireEvent.press(addPhotoButton);
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });
});
