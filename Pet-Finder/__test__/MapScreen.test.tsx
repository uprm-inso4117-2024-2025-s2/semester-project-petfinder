import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapScreen from '../app/(tabs)/MapScreen'; // Adjust path if needed
import * as Location from 'expo-location';

// Mocks
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  Accuracy: { High: 1, Balanced: 2 },
}));

// Static asset mocks
jest.mock('../assets/images/Pet_Finder_Assets/Pet_Logo.png', () => 0);
jest.mock('../assets/images/Pet_Finder_Assets/Pet_UserLocation.png', () => 0);
jest.mock('../assets/images/Pet_Finder_Assets/Pet_DogMarker.png', () => 0);
jest.mock('../assets/images/Pet_Finder_Assets/Pet_CatMarker.png', () => 0);

// Descriptor mock
jest.mock('@/components/descriptor', () => 'Descriptor');

// Supabase mock
const mockEq = jest.fn().mockReturnThis();
const mockIlike = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockReturnThis();
const mockLimit = jest.fn().mockReturnThis();
const mockFrom = jest.fn(() => ({
  select: mockSelect,
  order: mockOrder,
  limit: mockLimit,
  eq: mockEq,
  ilike: mockIlike,
}));

jest.mock('../utils/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

beforeEach(() => {
  jest.clearAllMocks();

  // Mock location
  (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
  (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
    coords: { latitude: 18.2095, longitude: -67.1408 },
  });

  // Mock Supabase fetch
  mockSelect.mockReturnValue({
    order: mockOrder,
    limit: mockLimit.mockReturnValue({
      eq: mockEq.mockReturnValue({
        ilike: mockIlike.mockResolvedValue({
          data: [
            {
              id: 1,
              name: 'Buddy',
              species: 'dog',
              latitude: 18.209,
              longitude: -67.141,
              photo_url: '',
              description: 'Friendly dog',
            },
          ],
          error: null,
        }),
      }),
    }),
  });
});

describe('MapScreen', () => {
  it('renders search bar and filter buttons', async () => {
    const { getByPlaceholderText, getByText } = render(<MapScreen />);
    await waitFor(() => {
      expect(getByPlaceholderText('Search...')).toBeTruthy();
      expect(getByText('Dog')).toBeTruthy();
      expect(getByText('Cat')).toBeTruthy();
      expect(getByText('Others')).toBeTruthy();
      expect(getByText('Clear')).toBeTruthy();
    });
  });

  it('applies species filter when filter button is pressed', async () => {
    const { getByText } = render(<MapScreen />);
    const dogButton = getByText('Dog');

    fireEvent.press(dogButton);

    await waitFor(() => {
      expect(mockEq).toHaveBeenCalledWith('species', 'dog');
    });
  });

  it('applies search filter when text is entered', async () => {
    const { getByPlaceholderText } = render(<MapScreen />);
    const searchInput = getByPlaceholderText('Search...');

    fireEvent.changeText(searchInput, 'Buddy');

    await waitFor(() => {
      expect(mockIlike).toHaveBeenCalledWith('name', '%Buddy%');
    });
  });


  it('handles user location button press', async () => {
    const { getByTestId } = render(<MapScreen />);
    const locationButton = getByTestId('userLocationButton');
    fireEvent.press(locationButton);

    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    });
  });
});
