import React from 'react';
import { Alert } from 'react-native';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
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

  it('completes the Lost Pet flow end-to-end', async () => {
    // 1️⃣ Mock permissions & picker result
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock)
      .mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock)
      .mockResolvedValue({ canceled: false, assets: [{ uri: 'dummy-uri' }] });
  
    const { getByText, getByPlaceholderText, getByTestId } = render(<ReportScreen />);
  
    // 2️⃣ Fill out Lost-pet form
    // (Lost is the default status, so no need to tap that radio)
    fireEvent.changeText(getByPlaceholderText('Enter pet name'), 'Buddy');
    fireEvent.changeText(getByPlaceholderText('Enter location'), 'Central Park');
  
    // 3️⃣ Pick date & time
    fireEvent.press(getByTestId('buttonPickDateTime'));
    // simulate user confirming “now”
    // after you fireEvent.press(buttonPickDateTime):
    fireEvent.press(getByTestId('datePicker'));

    // wait for the button text to update from the placeholder
    await waitFor(() =>
      expect(getByTestId('buttonPickDateTime').props.children).not.toBe('Pick Date and Time')
    );
  
    // 4️⃣ Description & photo
    fireEvent.changeText(getByTestId('inputDescription'), 'Friendly brown dog');
    fireEvent.press(getByText('Add Photo'));
    await waitFor(() => {
      expect(getByTestId('previewPhoto')).toBeTruthy();
    });
    // previewPhoto is rendered when photoUri is set
    expect(getByTestId('previewPhoto')).toBeTruthy();
  
    // 5️⃣ Contact info
    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Phone'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
  
    // 6️⃣ Submit and assert success alert
    fireEvent.press(getByTestId('buttonSubmitReport'));
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        'Submitted!',
        'Your report has been submitted.'
      )
    );
  });
  
  it('completes the Found/Stray Pet flow with photo removal', async () => {
    // 1️⃣ Mock picker again
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock)
      .mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock)
      .mockResolvedValue({ canceled: false, assets: [{ uri: 'dummy-uri' }] });
  
    const { getByText, getByPlaceholderText, getByTestId } = render(<ReportScreen />);
  
    // 2️⃣ Switch to Found/Stray
    fireEvent.press(getByText('Found/Stray'));
  
    // 3️⃣ Fill location & date
    fireEvent.changeText(getByPlaceholderText('Enter location'), '5th Avenue');
    fireEvent.press(getByTestId('buttonPickDateTime'));
    // after you fireEvent.press(buttonPickDateTime):
    fireEvent.press(getByTestId('datePicker'));

  
    // 4️⃣ Pick condition
    fireEvent.press(getByText('In my custody'));
  
    // 5️⃣ Add then remove photo
    fireEvent.press(getByText('Add Photo'));
    await waitFor(() => {
      expect(getByTestId('previewPhoto')).toBeTruthy();
    });
    expect(getByTestId('previewPhoto')).toBeTruthy();
    fireEvent.press(getByTestId('buttonRemovePhoto'));
    await waitFor(() =>
      expect(() => getByTestId('previewPhoto')).toThrow()
    );
  
    // 6️⃣ Contact info
    fireEvent.changeText(getByPlaceholderText('Name'), 'Jane Smith');
    fireEvent.changeText(getByPlaceholderText('Phone'), '0987654321');
    fireEvent.changeText(getByPlaceholderText('Email'), 'jane@example.com');
  
    // 7️⃣ Submit & assert
    fireEvent.press(getByTestId('buttonSubmitReport'));
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        'Submitted!',
        'Your report has been submitted.'
      )
    );
  });
});
