// Mock pet reports for testing purposes.
// TODO: Replace with API call once backend is available.

interface PetReport {
  id: number;
  name: string;
  status: 'lost' | 'found';
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  contactInfo: string;
}

const mockPetReports = [
  {
    id: 1,
    name: 'Broly',
    status: 'lost',
    description: 'Black pit bull lost near Central Park',
    latitude: 18.4655,
    longitude: -66.1057,
    image: 'https://via.placeholder.com/150',
    contactInfo: 'Owner: John Jones - (123) 456-7890',
  },
  {
    id: 2,
    name: 'Luna',
    status: 'found',
    description: 'Small black cat found near 5th Avenue',
    latitude: 18.4700,
    longitude: -66.1070,
    image: 'https://via.placeholder.com/150',
    contactInfo: 'Finder: Jane Smith - (987) 654-3210',
  },
];

const usePetReports = () => {
  return mockPetReports; // In the future, replace with API calls
};


/*
//API endpoint - replace with your actual backend URL
const API_URL = 'https://petfinder-api.com/reports';

//Asynchronous hook for fetching pet reports
const usePetReports = async (): Promise<PetReport[]> => {
  try {
    const response = await fetch(API_URL);

    // Check for successful response (status code 200-299)
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Convert response to JSON
    const data: PetReport[] = await response.json();
    return data; // Return the pet reports array

  } catch (error) {
    console.error('Error fetching pet reports:', error);

    // Fallback mock data (optional - remove when API is stable)
    return [
      {
        id: 1,
        name: 'Broly',
        status: 'lost',
        description: 'Golden retriever lost near Central Park',
        latitude: 18.4655,
        longitude: -66.1057,
        image: 'https://via.placeholder.com/150',
        contactInfo: 'Owner: John Jones - (123) 456-7890',
      },
      {
        id: 2,
        name: 'Luna',
        status: 'found',
        description: 'Small black cat found near 5th Avenue',
        latitude: 18.4700,
        longitude: -66.1070,
        image: 'https://via.placeholder.com/150',
        contactInfo: 'Finder: Jane Smith - (987) 654-3210',
      },
    ];
  }
};
*/

export default usePetReports;