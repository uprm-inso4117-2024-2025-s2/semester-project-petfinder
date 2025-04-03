import { render } from "@testing-library/react-native";
import { filterData } from "../../app/(tabs)/MapScreen";
import MapScreen from "../../app/(tabs)/MapScreen";
import { mockPets } from "../MockData";
import { performance } from "perf_hooks";
import { MapViewProps, MapMarkerProps, MapCalloutProps } from "react-native-maps";
import * as React from "react";

// Mock react-native-maps with type-safe props
jest.mock("react-native-maps", () => ({
  MapView: ({ children }: MapViewProps) => <div>{children}</div>,
  Marker: ({ children, testID }: MapMarkerProps & { testID?: string }) => (
    <div data-testid={testID}>{children}</div>
  ),
  Callout: ({ children }: MapCalloutProps) => <div>{children}</div>,
}));

// Mock expo-location to prevent errors during rendering
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
  watchPositionAsync: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
}));

// Performance tests for filterData
describe("MapScreen Performance", () => {
  it("filters and prepares 1000 pets under 1 second", () => {
    const start = performance.now();
    const filteredData = filterData(mockPets, "", ""); // No search or filter
    const end = performance.now();
    const latency = (end - start) / 1000; // Convert ms to seconds
    console.log(`Filter Latency: ${latency}s, Throughput: ${1000 / latency} pets/s`);

    expect(filteredData.length).toBe(1000); // Verify all pets included
    expect(latency).toBeLessThan(1); // Assert < 1s
  });

  it("filters with query and type under 1 second", () => {
    const start = performance.now();
    const filteredData = filterData(mockPets, "Pet 5", "Dog");
    const end = performance.now();
    const latency = (end - start) / 1000;
    console.log(`Filtered Latency: ${latency}s`);

    expect(filteredData.length).toBeGreaterThan(0); // Some matches
    expect(latency).toBeLessThan(1);
  });
});
