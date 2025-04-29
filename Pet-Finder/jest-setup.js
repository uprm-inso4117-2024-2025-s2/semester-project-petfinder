// jest-setup.js

// *** Ensure AsyncStorage mock is defined BEFORE the Supabase mock ***
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
  );
  
  // --- Updated Supabase Mock ---
  const mockSupabaseInstance = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    // Mock any other Supabase functions you use (e.g., auth, rpc)
    // Add a mock for the final promise resolution.
    // We will override this specifically in tests, but having a default helps.
    then: jest.fn((resolve) => resolve({ data: [], error: null })),
    // Add mocks for other top-level methods if needed (e.g., rpc)
    rpc: jest.fn(),
  };
  
  // Mock the entire module that exports the supabase client
  // Adjust the path '../../utils/supabase' if it's different
  jest.mock('./utils/supabase', () => ({
    __esModule: true, // Needed for ES Modules
    // Ensure the exported name ('supabase') matches exactly what your app imports
    supabase: mockSupabaseInstance,
  }));
  // --- End of Updated Supabase Mock ---
  
  
  // --- Other mocks remain the same ---
  jest.mock('react-native-maps', () => { /* ... map mock ... */ });
  jest.mock('./assets/images/Pet_Finder_Assets/Pet_Logo.png', () => 0);
  // ... other image mocks ...
  jest.mock('@/components/descriptor', () => { /* ... descriptor mock ... */ });
  jest.mock('expo-location', () => ({ /* ... location mock ... */ }));
  jest.mock('react-native', () => { /* ... alert mock ... */ });
  
  // Add jest-native matchers
  import '@testing-library/jest-native/extend-expect';