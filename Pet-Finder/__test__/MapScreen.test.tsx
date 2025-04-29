import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapScreen from '../app/(tabs)/MapScreen'; // Adjust the import path
import { supabase } from '../utils/supabase'; // Import the mocked supabase
import * as Location from 'expo-location'; // Import the mocked location
import { Alert } from 'react-native';

// Type cast mocks for better type checking
const mockedSupabase = supabase as jest.Mocked<typeof supabase>;
const mockedLocation = Location as jest.Mocked<typeof Location>;
const mockedAlert = Alert.alert as jest.Mock;

// Helper to create mock pet data
const createMockPet = (id: number, name: string, species: string, lat: number, lon: number): Pet => ({
  id,
  name,
  species,
  latitude: lat,
  longitude: lon,
  photo_url: `http://example.com/${name}.jpg`,
  description: `A lovely ${species} named ${name}`,
});

// Sample Pet Data
const mockPets = [
  createMockPet(1, 'Buddy', 'dog', 18.21, -67.14),
  createMockPet(2, 'Lucy', 'cat', 18.22, -67.15),
  createMockPet(3, 'Rocky', 'dog', 18.20, -67.13),
  createMockPet(4, 'Whiskers', 'cat', 18.215, -67.145),
  createMockPet(5, 'Max', 'other', 18.205, -67.135),
];

// --- Test Suite ---
describe('MapScreen Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Default Supabase mock response (successful fetch, no data initially)
    // Reset the mock implementation for the final query result
     mockedSupabase.from = jest.fn().mockReturnThis();
     mockedSupabase.select = jest.fn().mockReturnThis();
     mockedSupabase.order = jest.fn().mockReturnThis();
     mockedSupabase.limit = jest.fn().mockReturnThis();
     mockedSupabase.eq = jest.fn().mockReturnThis();
     mockedSupabase.ilike = jest.fn().mockReturnThis();
     // Use mockResolvedValue for the final promise in the chain
     const mockQueryExecutor = {
        then: jest.fn(async (onfulfilled) => {
           // Default to empty array unless overridden in a specific test
           const result = { data: [], error: null };
           if(onfulfilled) return onfulfilled(result);
           return Promise.resolve(result);
        }),
        // Add catch/finally if your code uses them
     };
     // Make the last method in the chain return the executor
     (mockedSupabase.limit as jest.Mock).mockReturnValue(mockQueryExecutor);
     (mockedSupabase.ilike as jest.Mock).mockReturnValue(mockQueryExecutor);
     (mockedSupabase.eq as jest.Mock).mockReturnValue(mockQueryExecutor);


    // Default Location mock responses
    (mockedLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (mockedLocation.watchPositionAsync as jest.Mock).mockResolvedValue({ remove: jest.fn() });
    (mockedLocation.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 18.21, longitude: -67.14, accuracy: 5, altitude: null, heading: null, speed: null, altitudeAccuracy: null },
      timestamp: Date.now(),
    });
  });

  it('renders correctly with initial elements', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<MapScreen />);

    // Check for header elements
    expect(getByPlaceholderText('Search...')).toBeVisible();
    // Check for filter buttons
    expect(getByText('Dog')).toBeVisible();
    expect(getByText('Cat')).toBeVisible();
    expect(getByText('Others')).toBeVisible();
    expect(getByText('Clear')).toBeVisible();

    // Check if the map view mock is rendered
    expect(getByTestId('map-view')).toBeVisible();

    // Check if location permissions are requested on mount
    await waitFor(() => {
        expect(mockedLocation.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(2); // Called in both useEffects
    });
     // Check if initial data fetch is attempted (default mock returns empty array)
     await waitFor(() => {
       expect(mockedSupabase.from).toHaveBeenCalledWith('pets');
       expect(mockedSupabase.select).toHaveBeenCalled();
       expect(mockedSupabase.order).toHaveBeenCalled();
       expect(mockedSupabase.limit).toHaveBeenCalled(); // Initial fetch + filter fetch
     });
  });

  it('fetches and displays pet markers', async () => {
    // Mock Supabase to return specific pet data for this test
    const mockData = [mockPets[0], mockPets[1]]; // Buddy (dog) and Lucy (cat)
    // Override the mock implementation for the final promise resolution for THIS test
    (mockedSupabase.limit as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const { findByTestId } = render(<MapScreen />);

    // Wait for markers to appear based on the fetched data
    // Check using the Descriptor mock's testID
    const marker1 = await findByTestId(`descriptor-${mockData[0].id}`);
    const marker2 = await findByTestId(`descriptor-${mockData[1].id}`);

    expect(marker1).toHaveTextContent('Buddy');
    expect(marker2).toHaveTextContent('Lucy');

    // Check that Supabase was called (it's called on mount + filter effect)
     await waitFor(() => {
         expect(mockedSupabase.from).toHaveBeenCalledWith('pets');
     });
  });

  it('filters pets by species when a filter button is pressed', async () => {
    const { getByText } = render(<MapScreen />);

    // Mock the response *after* the filter is applied
    const dogFilterMock = jest.fn().mockResolvedValue({ data: [mockPets[0], mockPets[2]], error: null });
    (mockedSupabase.eq as jest.Mock).mockReturnValue({ // Mock the return of .eq()
      then: dogFilterMock // Make .then available after .eq()
    });


    const dogButton = getByText('Dog');
    fireEvent.press(dogButton);

    // Wait for the filtering fetch to complete
    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith('pets');
      expect(mockedSupabase.eq).toHaveBeenCalledWith('species', 'dog'); // Case insensitive handled by DB usually, but mock expects exact value from code
      expect(dogFilterMock).toHaveBeenCalled();
    });

     // You could add further assertions here to check if ONLY dog markers are rendered
     // e.g., query for markers and check their content/props if needed, using findByTestId
     // await expect(findByTestId(`descriptor-${mockPets[0].id}`)).resolves.toBeVisible();
     // await expect(queryByTestId(`descriptor-${mockPets[1].id}`)).rejects.toThrow(); // Expect cat not to be found
  });

   it('filters pets by name when search query is entered', async () => {
    const { getByPlaceholderText } = render(<MapScreen />);

    // Mock the response *after* the search is applied
    const searchFilterMock = jest.fn().mockResolvedValue({ data: [mockPets[0]], error: null });
     (mockedSupabase.ilike as jest.Mock).mockReturnValue({ // Mock the return of .ilike()
        then: searchFilterMock
     });


    const searchInput = getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'Buddy');

    // Wait for the filtering fetch to complete
    await waitFor(() => {
      expect(mockedSupabase.from).toHaveBeenCalledWith('pets');
      expect(mockedSupabase.ilike).toHaveBeenCalledWith('name', '%Buddy%');
      expect(searchFilterMock).toHaveBeenCalled();
    });

     // Add assertions to check if only 'Buddy' is rendered if needed
  });

  it('clears filters when "Clear" button is pressed', async () => {
    const { getByText } = render(<MapScreen />);

    // Mock responses for filtering and clearing
    const dogFilterMock = jest.fn().mockResolvedValue({ data: [mockPets[0]], error: null });
    const clearFilterMock = jest.fn().mockResolvedValue({ data: mockPets.slice(0,2), error: null }); // Return some data on clear

    // Simulate applying a filter first
     (mockedSupabase.eq as jest.Mock).mockReturnValue({ then: dogFilterMock });
    fireEvent.press(getByText('Dog'));
    await waitFor(() => expect(dogFilterMock).toHaveBeenCalled());
    expect(mockedSupabase.eq).toHaveBeenCalledWith('species', 'dog');
    jest.clearAllMocks(); // Clear mocks before pressing clear


     // Now press clear
    (mockedSupabase.limit as jest.Mock).mockResolvedValue({ data: mockPets.slice(0,2), error: null }); // Reset default fetch mock for clear
    const clearButton = getByText('Clear');
    fireEvent.press(clearButton);

    // Wait for the fetch after clearing
    await waitFor(() => {
       expect(mockedSupabase.from).toHaveBeenCalledWith('pets');
       // Crucially, .eq() or .ilike() should NOT have been called for the 'clear' fetch
       expect(mockedSupabase.eq).not.toHaveBeenCalled();
       expect(mockedSupabase.ilike).not.toHaveBeenCalled();
       expect(mockedSupabase.limit).toHaveBeenCalled(); // The base query is still run
    });

  });

  it('calls mapRef.animateCamera when "Go to Current Location" button is pressed', async () => {
    // Need a ref mock accessible here
    const mockAnimateCamera = jest.fn();
    const mockMapRef = {
        current: {
            animateCamera: mockAnimateCamera,
        },
    };
    // Mock useState to control the ref
    jest.spyOn(React, 'useRef').mockReturnValue(mockMapRef);
    // Mock location to ensure userLocation state is set
    const mockUserLocation = {
        coords: { latitude: 18.25, longitude: -67.15, accuracy: 5, altitude: null, heading: null, speed: null, altitudeAccuracy: null },
        timestamp: Date.now(),
    };
    (mockedLocation.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockUserLocation);


    const { getByRole } = render(<MapScreen />); // Assuming TouchableOpacity has implicit role='button'

    // Wait for location to be potentially set
    await waitFor(() => expect(mockedLocation.getCurrentPositionAsync).toHaveBeenCalled());

    // Find the button - might need a testID if getByRole is unreliable
    // Let's assume the TouchableOpacity wrapping the Image acts like a button
    const locationButton = getByRole('button'); // Adjust query if needed (e.g., getByTestId)
    fireEvent.press(locationButton);

    // Check if animateCamera was called with the correct coordinates
    expect(mockAnimateCamera).toHaveBeenCalledWith({
      center: {
        latitude: mockUserLocation.coords.latitude,
        longitude: mockUserLocation.coords.longitude,
      },
      altitude: 2000,
      zoom: 15,
    });

     // Restore useRef mock
     jest.restoreAllMocks(); // or specifically restore the useRef spy
  });

  it('shows an alert if fetching data fails', async () => {
    // Mock Supabase to return an error
    const errorMessage = 'Database connection failed';
    (mockedSupabase.limit as jest.Mock).mockResolvedValue({ data: null, error: new Error(errorMessage) });

    render(<MapScreen />);

    // Wait for the alert mock to have been called
    await waitFor(() => {
      expect(mockedAlert).toHaveBeenCalledTimes(1);
      expect(mockedAlert).toHaveBeenCalledWith(
        "Error",
        expect.stringContaining(errorMessage) // Check if the error message is included
      );
    });
  });

   it('handles location permission denial gracefully', async () => {
    // Mock permission denied
    (mockedLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    render(<MapScreen />);

    // Wait briefly to ensure no crashes
    await new Promise(resolve => setTimeout(resolve, 50)); // Small delay

    // Assert that watch/getCurrentPosition were NOT called if permission denied
    expect(mockedLocation.watchPositionAsync).not.toHaveBeenCalled();
    // getCurrentPositionAsync might still be called in the second effect before status check,
    // but the core logic inside should handle the denial.
    // If the component logic changes to check status *before* calling getCurrentPositionAsync, update this assertion.
     // expect(mockedLocation.getCurrentPositionAsync).not.toHaveBeenCalled();

     // Ensure no errors were thrown implicitly
  });

});

// --- Separate tests for utility functions if desired ---
describe('filterData Utility Function', () => {
    const pets = [
        createMockPet(1, 'Buddy', 'Dog', 1, 1),
        createMockPet(2, 'Lucy', 'Cat', 1, 1),
        createMockPet(3, 'Rocky', 'Dog', 1, 1),
        createMockPet(4, 'Goldie', 'Other', 1, 1),
    ];

    it('filters by species correctly', () => {
        const filtered = filterData(pets, '', 'Dog');
        expect(filtered).toHaveLength(2);
        expect(filtered.map(p => p.name)).toEqual(['Buddy', 'Rocky']);
    });

    it('filters by search query correctly', () => {
        const filtered = filterData(pets, 'Lucy', '');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Lucy');
    });

    it('filters by both species and search query', () => {
        const filtered = filterData(pets, 'R', 'Dog');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Rocky');
    });

    it('returns all pets when filters are empty', () => {
        const filtered = filterData(pets, '', '');
        expect(filtered).toHaveLength(4);
    });

     it('returns empty array if no match', () => {
        const filtered = filterData(pets, 'NonExistent', 'Cat');
        expect(filtered).toHaveLength(0);
    });
});