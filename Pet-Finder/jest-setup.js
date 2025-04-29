// jest-setup.js
import '@testing-library/jest-native/extend-expect';

// Mock React Native AsyncStorage (if used indirectly by dependencies)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = React.forwardRef((props, ref) => {
    // Expose mock functions via ref if needed
    React.useImperativeHandle(ref, () => ({
      animateCamera: jest.fn(),
      // Add other methods you might call on the ref
    }));
    return <View {...props} testID="map-view">{props.children}</View>;
  });
  const MockMarker = (props) => <View {...props} testID="map-marker">{props.children}</View>;
  const MockCallout = (props) => <View {...props} testID="map-callout">{props.children}</View>;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
    PROVIDER_GOOGLE: 'google', // Or whatever provider you use
  };
});

// Mock Image Assets
// This prevents errors when 'require' is used for images in tests
jest.mock('../../assets/images/Pet_Finder_Assets/Pet_Logo.png', () => 0);
jest.mock('../../assets/images/Pet_Finder_Assets/Pet_DogMarker.png', () => 1);
jest.mock('../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png', () => 2);
jest.mock('../../assets/images/Pet_Finder_Assets/Pet_UserLocation.png', () => 3);

// Mock Child Component
jest.mock('@/components/descriptor', () => {
    const React = require('react');
    const { Text } = require('react-native');
    // Simple mock that displays the pet's name
    return (props) => <Text testID={`descriptor-${props.id}`}>{props.name}</Text>;
});

// Mock Supabase
// We'll refine this mock within the test file for more specific scenarios
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    // Default mock implementation for the final promise resolution
    then: jest.fn((resolve) => resolve({ data: [], error: null })),
  },
}));

// Mock Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: {
    High: 'high',
    Balanced: 'balanced',
  },
}));

// Mock Alert
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.Alert.alert = jest.fn();
    return RN;
});