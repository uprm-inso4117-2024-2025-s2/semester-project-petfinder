import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import MapScreen from './MapScreen';
import * as Location from 'expo-location';
import { Pet } from './MapScreen';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: {
    High: 'high',
  },
}));

describe('MapScreen', () => {
  const mockPets: Pet[] = [
    { 
      id: 1, 
      name: "Henry", 
      type: "Dog", 
      location: { latitude: 18.209533, longitude: -67.140849 }, 
      photo: require("../../assets/images/Pet_Finder_Assets/dog.png"), 
      description: "He's a big dog" 
    },
    { 
      id: 2, 
      name: "Jose", 
      type: "Dog", 
      location: { latitude: 18.219533, longitude: -67.140849 }, 
      photo: require("../../assets/images/Pet_Finder_Assets/dog.png"), 
      description: "He's a big Dog" 
    },
    { 
      id: 3, 
      name: "Lara", 
      type: "Cat", 
      location: { latitude: 18.219633, longitude: -67.141749 }, 
      photo: require("../../assets/images/Pet_Finder_Assets/cat.png"), 
      description: "He's a big cat" 
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial state', () => {
    const { getByPlaceholderText, getByText } = render(<MapScreen />);
    
    expect(getByPlaceholderText('Search...')).toBeTruthy();
    expect(getByText('Dog')).toBeTruthy();
    expect(getByText('Cat')).toBeTruthy();
    expect(getByText('Others')).toBeTruthy();
  });

  it('requests location permission on mount', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    
    (Location.watchPositionAsync as jest.Mock).mockImplementation((_, callback) => {
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
    });

    await act(async () => {
      render(<MapScreen />);
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.watchPositionAsync).toHaveBeenCalled();
  });

  it('filters pets by search query', async () => {
    const { getByPlaceholderText, queryByText } = render(<MapScreen />);
    const searchInput = getByPlaceholderText('Search...');
    
    fireEvent.changeText(searchInput, 'Henry');
    
    expect(queryByText('Henry')).toBeTruthy();
    expect(queryByText('Jose')).toBeNull();
    expect(queryByText('Lara')).toBeNull();
  });

  it('filters pets by type', async () => {
    const { getByText, queryByText } = render(<MapScreen />);
    
    fireEvent.press(getByText('Cat'));
    
    expect(queryByText('Lara')).toBeTruthy();
    expect(queryByText('Henry')).toBeNull();
    expect(queryByText('Jose')).toBeNull();
  });

  it('shows all pets when no filters are applied', async () => {
    const { getByText } = render(<MapScreen />);
    
    expect(getByText('Henry')).toBeTruthy();
    expect(getByText('Jose')).toBeTruthy();
    expect(getByText('Lara')).toBeTruthy();
  });

  it('combines search and type filters', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<MapScreen />);
    
    fireEvent.press(getByText('Dog'));
    fireEvent.changeText(getByPlaceholderText('Search...'), 'Jose');
    
    expect(queryByText('Jose')).toBeTruthy();
    expect(queryByText('Henry')).toBeNull();
    expect(queryByText('Lara')).toBeNull();
  });

  it('displays correct marker images based on pet type', async () => {
    const { getAllByTestId } = render(<MapScreen />);
    
    // This would need marker components to have testIDs for proper testing
    // In a real implementation, you might need to adjust this
    const markers = getAllByTestId('pet-marker');
    expect(markers.length).toBe(mockPets.length);
  });

  it('handles location permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    await act(async () => {
      render(<MapScreen />);
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.watchPositionAsync).not.toHaveBeenCalled();
  });

  it('cleans up location subscription on unmount', async () => {
    const mockRemove = jest.fn();
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.watchPositionAsync as jest.Mock).mockReturnValue({
      remove: mockRemove,
    });

    const { unmount } = render(<MapScreen />);
    
    unmount();
    
    expect(mockRemove).toHaveBeenCalled();
  });
});

describe('filterData', () => {
  const mockPets: Pet[] = [
    { 
      id: 1, 
      name: "Henry", 
      type: "Dog", 
      location: { latitude: 0, longitude: 0 }, 
      photo: '', 
      description: "" 
    },
    { 
      id: 2, 
      name: "Lara", 
      type: "Cat", 
      location: { latitude: 0, longitude: 0 }, 
      photo: '', 
      description: "" 
    },
  ];

  it('returns all pets when no filters are applied', () => {
    const result = filterData(mockPets, '', '');
    expect(result.length).toBe(2);
  });

  it('filters by type correctly', () => {
    const result = filterData(mockPets, '', 'Dog');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Henry');
  });

  it('filters by search query correctly', () => {
    const result = filterData(mockPets, 'Lara', '');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Lara');
  });

  it('combines type and search filters', () => {
    const result = filterData(mockPets, 'Henry', 'Dog');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Henry');
  });

  it('returns empty array when no matches', () => {
    const result = filterData(mockPets, 'Nonexistent', 'Bird');
    expect(result.length).toBe(0);
  });
});
