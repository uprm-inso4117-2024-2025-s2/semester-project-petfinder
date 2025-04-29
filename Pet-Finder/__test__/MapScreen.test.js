
import React from 'react';
import { render } from '@testing-library/react-native';
import MapScreen from '../app/(tabs)/MapScreen';
import { performance } from 'perf_hooks';

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
    default: (props) => <View {...props} />,
    Marker: (props) => <View {...props} />,
    Callout: (props) => <View {...props} />,
  };
});

jest.mock("@/components/descriptor", () => ({
  __esModule: true,
  default: (props) => <></>,
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