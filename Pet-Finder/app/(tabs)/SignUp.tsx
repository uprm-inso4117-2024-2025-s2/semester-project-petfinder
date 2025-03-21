import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333333',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#16A849',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  socialButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#16A849',
  },
});

const SignUpForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  // Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_EXPO_CLIENT_ID', // Replace with your Google Expo client ID
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID', // Replace with your Google iOS client ID
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID', // Replace with your Google Android client ID
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Replace with your Google web client ID
  });

  // Facebook OAuth
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
  });

  // Handle Google OAuth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleSocialSignIn('google', authentication.accessToken);
      }
    }
  }, [response]);

  // Handle Facebook OAuth response
  React.useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      if (authentication?.accessToken) {
        handleSocialSignIn('facebook', authentication.accessToken);
      }
    }
  }, [fbResponse]);

  // Handle social sign-in with Supabase
  const handleSocialSignIn = async (provider: 'google' | 'facebook', accessToken: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'myapp://auth-callback', // Replace with your app's redirect URL
        },
      });

      if (error) {
        setErrorMessages({ general: error.message });
        setLoading(false);
        return;
      }

      setErrorMessages({});
      router.replace('/LoginScreen');
    } catch (err) {
      setErrorMessages({ general: 'An unexpected error occurred. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    let errors: { [key: string]: string } = {};

    if (!fullName) errors.fullName = 'Full name is required.';
    if (!email) errors.email = 'Email is required.';
    if (!phoneNumber) errors.phoneNumber = 'Phone number is required.';
    if (!password) errors.password = 'Password is required.';
    if (!dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';

    const emailRegex = /\S+@\S+\.\S+/;
    if (email && !emailRegex.test(email)) errors.email = 'Invalid email format.';

    if (password.length > 0 && password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (!(/\d/.test(password) && /[\W_]/.test(password))) errors.password = 'Password must contain at least one number and one special character';

    // Validate Date of Birth (Format: MM/DD/YYYY)
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    if (dateOfBirth && !dobRegex.test(dateOfBirth)) errors.dateOfBirth = 'Format must be MM/DD/YYYY.';

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            date_of_birth: dateOfBirth,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) {
        setErrorMessages({ general: error.message });
        setLoading(false);
        return;
      }

      setErrorMessages({});
      router.replace('/LoginScreen');
    } catch (err) {
      setErrorMessages({ general: 'An unexpected error occurred. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const DateOfBirthInput = () => {
    if (Platform.OS === 'web') {
      return (
        <TextInput
          style={styles.input}
          placeholder="MM/DD/YYYY"
          value={dateOfBirth}
          onChangeText={(text) => {
            setDateOfBirth(text);
            setErrorMessages((prev) => ({ ...prev, dateOfBirth: '' }));
          }}
        />
      );
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            console.log('Date picker button clicked!');
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.input}>
            {dateOfBirth || 'Select your date of birth'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              console.log('Date picker closed!');
              setShowDatePicker(false);
              if (selectedDate) {
                const formattedDate = selectedDate.toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                });
                console.log('Selected Date:', formattedDate);
                setDateOfBirth(formattedDate);
                setErrorMessages((prev) => ({ ...prev, dateOfBirth: '' }));
              }
            }}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create an account to continue!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            setErrorMessages((prev) => ({ ...prev, fullName: '' }));
          }}
        />
        {errorMessages.fullName && <Text style={styles.errorText}>{errorMessages.fullName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessages((prev) => ({ ...prev, email: '' }));
          }}
        />
        {errorMessages.email && <Text style={styles.errorText}>{errorMessages.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <DateOfBirthInput />
        {errorMessages.dateOfBirth && <Text style={styles.errorText}>{errorMessages.dateOfBirth}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            setErrorMessages((prev) => ({ ...prev, phoneNumber: '' }));
          }}
        />
        {errorMessages.phoneNumber && <Text style={styles.errorText}>{errorMessages.phoneNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Set Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessages((prev) => ({ ...prev, password: '' }));
          }}
        />
        <Text style={{ fontSize: 12, color: '#666666' }}>
          Password must be at least 8 characters long and include a number and special character.
        </Text>
        {errorMessages.password && <Text style={styles.errorText}>{errorMessages.password}</Text>}
      </View>

      {errorMessages.general && <Text style={styles.errorText}>{errorMessages.general}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      {/* Google Sign-Up Button */}
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.socialButtonText}>Sign up with Google</Text>
      </TouchableOpacity>

      {/* Facebook Sign-Up Button */}
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => fbPromptAsync()}
        disabled={!fbRequest}
      >
        <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <TouchableOpacity onPress={() => router.replace('/LoginScreen')}>
          <Text style={{ fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default SignUpForm;