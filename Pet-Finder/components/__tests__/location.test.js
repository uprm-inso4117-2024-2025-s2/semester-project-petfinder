import * as Location from "expo-location";

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

describe("Location Service", () => {
  jest.setTimeout(10000)
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  it("should request foreground permissions", async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: "granted" });

    const permission = await Location.requestForegroundPermissionsAsync();
    expect(permission.status).toBe("granted");
  });

  it("should fetch the current location when permission is granted", async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: "granted" });
    const mockLocation = { coords: { latitude: 37.7749, longitude: -122.4194 } };
    Location.getCurrentPositionAsync.mockResolvedValueOnce(mockLocation);

    const permission = await Location.requestForegroundPermissionsAsync();
    expect(permission.status).toBe("granted");

    const location = await Location.getCurrentPositionAsync();
    expect(location.coords.latitude).toBe(37.7749);
    expect(location.coords.longitude).toBe(-122.4194);
  });

  it("should handle denied permissions", async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: "denied" });

    const permission = await Location.requestForegroundPermissionsAsync();
    expect(permission.status).toBe("denied");
  });

  it("should not fetch location if permission is denied", async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: "denied" });

    const permission = await Location.requestForegroundPermissionsAsync();
    expect(permission.status).toBe("denied");

    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it("should handle location retrieval errors", async () => {
    Location.getCurrentPositionAsync.mockRejectedValueOnce(new Error("Location error"));

    await expect(Location.getCurrentPositionAsync()).rejects.toThrow("Location error");
  });

  it("should handle timeout errors", async () => {
    Location.getCurrentPositionAsync.mockRejectedValueOnce(
      new Error("Location request timed out")
    );
  
    await expect(Location.getCurrentPositionAsync()).rejects.toThrowError(
      "Location request timed out"
    );
  });

  it("should not take too long to fetch location", async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: "granted" });
    const mockLocation = { coords: { latitude: 37.7749, longitude: -122.4194 } };
    Location.getCurrentPositionAsync.mockResolvedValueOnce(mockLocation);

    const startTime = performance.now();
    const location = await Location.getCurrentPositionAsync();
    const endTime = performance.now(); 
    const duration = endTime - startTime; 
    expect(duration).toBeLessThan(2000);

    expect(location.coords.latitude).toBe(37.7749);
    expect(location.coords.longitude).toBe(-122.4194);
  });

  it("should simulate slow network or hardware", async () => {
    jest.setTimeout(10000); // Increase the timeout to 10 seconds for this test
  
    // Simulate a slow response by delaying the mock
    Location.getCurrentPositionAsync.mockResolvedValueOnce(
      new Promise((resolve) => setTimeout(() => resolve({ coords: { latitude: 37.7749, longitude: -122.4194 } }), 5000)) // 5 seconds delay
    );
  
    const location = await Location.getCurrentPositionAsync();
    expect(location.coords.latitude).toBe(37.7749);
    expect(location.coords.longitude).toBe(-122.4194);
  });
  
});
