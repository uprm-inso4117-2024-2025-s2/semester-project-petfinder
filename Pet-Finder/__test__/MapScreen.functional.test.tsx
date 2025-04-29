import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import MapScreen from 'C:/Users/USER/Downloads/semester-project-petfinder-main/Pet-Finder/app/(tabs)/MapScreen';
import * as Location from 'expo-location';

// Mock the expo-location module
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  watchPositionAsync: jest.fn((options, callback) => {
    callback({
      coords: {
        latitude: 18.209533,
        longitude: -67.140849,
        accuracy: 10,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
      },
      timestamp: 0,
    });
    return { remove: jest.fn() };
  }),
  Accuracy: {
    High: 'high',
  },
}));

// Mock the MapView component since it's a native component
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMarker = (props: any) => <View testID="mock-marker" {...props} />;
  const MockCallout = (props: any) => <View testID="mock-callout" {...props} />;
  const MockMapView = (props: any) => <View testID="mock-map-view" {...props} />;
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
  };
});

describe('MapScreen Functional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the initial UI elements correctly', async () => {
    render(<MapScreen />);
    
    // Check for logo
    expect(screen.getByTestId('logo-image')).toBeTruthy();
    
    // Check for search bar
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
    
    // Check for filter buttons
    expect(screen.getByText('Dog')).toBeTruthy();
    expect(screen.getByText('Cat')).toBeTruthy();
    expect(screen.getByText('Others')).toBeTruthy();
    
    // Check if map is rendered
    expect(screen.getByTestId('mock-map-view')).toBeTruthy();
  });

  it('should request location permission and show user location', async () => {
    render(<MapScreen />);
    
    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.watchPositionAsync).toHaveBeenCalled();
    });
  });

  it('should filter pets when searching by name', async () => {
    render(<MapScreen />);
    
    // Initial render should show all markers (3 pets)
    let markers = await screen.findAllByTestId('mock-marker');
    expect(markers.length).toBe(3);
    
    // Search for "Henry"
    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Henry');
    
    await waitFor(() => {
      markers = screen.getAllByTestId('mock-marker');
      expect(markers.length).toBe(1); // Only Henry should remain
    });
  });

  it('should filter pets by type when button is pressed', async () => {
    render(<MapScreen />);
    
    // Initial render should show all markers
    let markers = await screen.findAllByTestId('mock-marker');
    expect(markers.length).toBe(3);
    
    // Filter by "Cat"
    fireEvent.press(screen.getByText('Cat'));
    
    await waitFor(() => {
      markers = screen.getAllByTestId('mock-marker');
      expect(markers.length).toBe(1); // Only Lara (the cat) should remain
    });
  });

  it('should combine search and filter functionality', async () => {
    render(<MapScreen />);
    
    // Filter by "Dog" first
    fireEvent.press(screen.getByText('Dog'));
    
    // Then search for "Jose"
    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Jose');
    
    await waitFor(() => {
      const markers = screen.getAllByTestId('mock-marker');
      expect(markers.length).toBe(1); // Only Jose (dog) should remain
    });
  });

  it('should show callout when marker is pressed', async () => {
    render(<MapScreen />);
    
    // Get the first marker (Henry)
    const markers = await screen.findAllByTestId('mock-marker');
    fireEvent.press(markers[0]);
    
    // Check if callout is shown
    await waitFor(() => {
      expect(screen.getByTestId('mock-callout')).toBeTruthy();
    });
  });

  it('should reset filters when search is cleared', async () => {
    render(<MapScreen />);
    
    // First apply a filter and search
    fireEvent.press(screen.getByText('Dog'));
    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'Henry');
    
    // Then clear the search
    fireEvent.changeText(screen.getByPlaceholderText('Search...'), '');
    
    await waitFor(() => {
      const markers = screen.getAllByTestId('mock-marker');
      expect(markers.length).toBe(2); // All dogs (Henry and Jose) should show
    });
  });
});
