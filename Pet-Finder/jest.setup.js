import 'fast-check';
import '@testing-library/jest-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn()
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signIn: jest.fn().mockResolvedValue({ data: {}, error: null })
    }
  })
}));

// Add global test timeout for fuzz tests
jest.setTimeout(10000);