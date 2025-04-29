import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import MapScreen from 'C:/Users/USER/Downloads/semester-project-petfinder-main/Pet-Finder/app/(tabs)/MapScreen';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMarker = (props: any) => <View testID={`marker-${props.identifier}`} {...props} />;
  const MockMapView = (props: any) => <View testID="map" {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mock Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  watchPositionAsync: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
}));

describe('MapScreen Automated Tests', () => {
  it('renders the map and search bar', () => {
    render(<MapScreen />);
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
    expect(screen.getByTestId('map')).toBeTruthy();
  });

  it('filters pets when typing in search', async () => {
    render(<MapScreen />);
    
    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Henry');
    
    await waitFor(() => {
      expect(screen.getByTestId('marker-1')).toBeTruthy(); // Henry's marker
      expect(screen.queryByTestId('marker-2')).toBeNull();  // Jose's marker should disappear
    });
  });

  it('shows only dogs when "Dog" filter is pressed', async () => {
    render(<MapScreen />);
    
    fireEvent.press(screen.getByText('Dog'));
    
    await waitFor(() => {
      expect(screen.getByTestId('marker-1')).toBeTruthy(); // Henry (Dog)
      expect(screen.getByTestId('marker-2')).toBeTruthy(); // Jose (Dog)
      expect(screen.queryByTestId('marker-3')).toBeNull(); // Lara (Cat) hidden
    });
  });

  it('combines search and filter', async () => {
    render(<MapScreen />);
    
    fireEvent.press(screen.getByText('Dog'));
    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Jose');
    
    await waitFor(() => {
      expect(screen.getByTestId('marker-2')).toBeTruthy(); // Jose (Dog)
      expect(screen.queryByTestId('marker-1')).toBeNull();  // Henry (Dog) hidden by search
    });
  });
});
