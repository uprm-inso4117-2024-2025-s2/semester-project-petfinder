// jest.config.js
module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'], // Path to your setup file
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo-location|expo-modules-core|@react-native-async-storage)', // Adjust based on your dependencies
    ],
    moduleNameMapper: {
       // If you use path aliases like @/components
      '^@/(.*)$': '<rootDir>/src/$1', // Adjust path accordingly
      // Add other aliases if needed
    },
    // Optional: Collect coverage
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}', // Adjust to your source directory
      '!src/**/*.d.ts',
      '!src/**/index.{js,ts}', // Often entry points don't need coverage
    ],
  };