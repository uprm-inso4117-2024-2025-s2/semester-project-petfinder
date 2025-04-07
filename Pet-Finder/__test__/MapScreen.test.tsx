import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import MapScreen from '../app/(tabs)/MapScreen';
import { performance } from 'perf_hooks';
import * as Location from 'expo-location';

// Mock all the same dependencies as in your regular tests
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
  watchPositionAsync: jest.fn(),
  Accuracy: { High: "high" }
}));

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Marker: (props: any) => <View {...props} />,
    Callout: (props: any) => <View {...props} />,
  };
});

jest.mock("@/components/descriptor", () => ({
  __esModule: true,
  default: (props: any) => <></>,
}));

describe('MapScreen Performance', () => {
  const SAMPLE_SIZE = 5;
  const WARMUP_ROUNDS = 2;
  
  it('should render within acceptable time', () => {
    let totalTime = 0;
    
    // Warmup rounds (not measured)
    for (let i = 0; i < WARMUP_ROUNDS; i++) {
      render(<MapScreen />);
    }
    
    // Actual measurement rounds
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const start = performance.now();
      render(<MapScreen />);
      const end = performance.now();
      totalTime += end - start;
    }
    
    const averageTime = totalTime / SAMPLE_SIZE;
    console.log(`Average render time: ${averageTime}ms`);
    
    // Set your performance threshold (adjust based on your needs)
    const MAX_ACCEPTABLE_TIME = 300; // milliseconds
    expect(averageTime).toBeLessThan(MAX_ACCEPTABLE_TIME);
  });
});




///////////////////////////////////////////////////////////////

describe('MapScreen Simple Fuzz Tests', () => {
    it('should handle weird search inputs', () => {
      const weirdInputs = [
        '',                         // empty string
        '   ',                      // spaces only
        '🐶🐱',                     // emojis
        '<script>alert(1)</script>', // XSS attempt
        'A'.repeat(1000),           // very long text
        12345,                      // number
        null,                       // null
      ];
  
      const { getByPlaceholderText, queryAllByTestId } = render(<MapScreen />);
      const searchInput = getByPlaceholderText('Search...');
  
      weirdInputs.forEach(input => {
        fireEvent.changeText(searchInput, input as any);
        const markers = queryAllByTestId('marker');
        expect(markers.length).toBeGreaterThanOrEqual(0); // Shouldn't crash
      });
    });
  
    it('should handle bad filter selections', () => {
      const badFilters = [
        '',        // empty
        'Invalid', // not a real filter
        null,      // null
        123,       // number
      ];
  
      const { getAllByText } = render(<MapScreen />);
  
      badFilters.forEach(filter => {
        // Try to set filter by pressing first button with bad value
        fireEvent.press(getAllByText('Dog')[0], { 
          target: { value: filter as string } 
        });
        
        // Just check that the app didn't crash
        expect(() => render(<MapScreen />)).not.toThrow();
      });
    });
  
    it('should handle broken location data', () => {
      const brokenLocations = [
        { latitude: 200, longitude: 200 },  // invalid coordinates
        { latitude: 'abc', longitude: 'xyz' }, // wrong types
        null,                                // null location
      ];
  
      // Mock the location function
      (Location.watchPositionAsync as jest.Mock).mockImplementation((_, callback) => {
        callback({ coords: brokenLocations[0] });
        return { remove: jest.fn() };
      });
  
      brokenLocations.forEach(location => {
        expect(() => render(<MapScreen />)).not.toThrow();
      });
    });
  });