import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define the expected shape of the error object
interface AuthError {
  code?: string;
  message?: string;
}

// Define the context's value type
interface ErrorHandlerContextType {
  handleAuthError: (error: AuthError) => void;
  error: AuthError | null;
}

// Define the props for the provider
interface ErrorHandlerProviderProps {
  children: ReactNode;
}

// Create the context with proper typing
const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(undefined);

export const ErrorHandlerProvider: React.FC<ErrorHandlerProviderProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [error, setError] = useState<AuthError | null>(null);

  const handleAuthError = (error: AuthError) => {
    console.error('Authentication Error:', error);

    switch (error.code) {
      case 'auth/user-not-found':
        Alert.alert('Login Failed', 'No user found with this email.');
        break;
      case 'auth/wrong-password':
        Alert.alert('Login Failed', 'Incorrect password. Please try again.');
        break;
      case 'auth/invalid-email':
        Alert.alert('Login Failed', 'Invalid email address format.');
        break;
      case 'auth/network-request-failed':
        Alert.alert('Network Error', 'Please check your internet connection.');
        break;
      case 'auth/expired-session':
        Alert.alert('Session Expired', 'Please log in again.');
        navigation.navigate('Login');
        break;
      default:
        Alert.alert('Authentication Error', error.message || 'Something went wrong.');
    }
    setError(error);
  };

  return (
    <ErrorHandlerContext.Provider value={{ handleAuthError, error }}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

export const useErrorHandler = (): ErrorHandlerContextType => {
  const context = useContext(ErrorHandlerContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider');
  }
  return context;
};