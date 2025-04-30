import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MapScreen from '../app/(tabs)/MapScreen';
import * as Location from 'expo-location';

// Mock expo-location with proper async behavior
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() => 
    Promise.resolve({
      coords: { latitude: 18.2095, longitude: -67.1408 }
    })
  ),
  watchPositionAsync: jest.fn(() => {
    return Promise.resolve({ remove: jest.fn() });
  }),
  Accuracy: { High: 1, Balanced: 2 },
}));

// Mock static assets
jest.mock('../assets/images/Pet_Finder_Assets/Pet_Logo.png', () => 0);
jest.mock('../assets/images/Pet_Finder_Assets/Pet_UserLocation.png', () => 0);
jest.mock('../assets/images/Pet_Finder_Assets/Pet_DogMarker.png', () => 0);
jest.mock('../assets/images/Pet_Finder_Assets/Pet_CatMarker.png', () => 0);

// Mock descriptor component
jest.mock('@/components/descriptor', () => 'Descriptor');

describe('MapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('handles user location button press', async () => {
    const { getByTestId } = render(<MapScreen />);
    
    await act(async () => {
      fireEvent.press(getByTestId('userLocationButton'));
      await Promise.resolve(); // Allow any pending promises to resolve
    });

    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
  });

  
  it('toggles filter buttons', async () => {
    const { getByText } = render(<MapScreen />);
    const dogButton = getByText('Dog');
    const catButton = getByText('Cat');
    
    await act(async () => {
      fireEvent.press(dogButton);
      await Promise.resolve();
    });
    
    await act(async () => {
      fireEvent.press(catButton);
      await Promise.resolve();
    });
    
    // Add assertions for visual feedback if available
  });
});