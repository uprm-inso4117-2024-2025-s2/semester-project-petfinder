module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test|fuzz).js',
    '**/__tests__/**/*.tsx',
    '**/?(*.)+(spec|test|fuzz).tsx'
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/Pet-Finder/$1"
  },
};
