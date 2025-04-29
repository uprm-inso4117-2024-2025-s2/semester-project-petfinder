// jest-setup.js

// ✅ Extend jest-native matchers (runs only in Jest environment)

// ✅ AsyncStorage mock (must be BEFORE Supabase)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 🛑 Move complex mocks like this into a separate file or into individual tests
