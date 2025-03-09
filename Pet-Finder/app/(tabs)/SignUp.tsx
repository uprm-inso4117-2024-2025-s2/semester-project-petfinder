import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

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
    fontWeight: "bold",
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
  const router = useRouter();

  // 🔹 Input Validation with Error Messages
  const validateInputs = () => {
    let errors: { [key: string]: string } = {};

    if (!fullName) errors.fullName = 'Full name is required.';
    if (!email) errors.email = 'Email is required.';
    if (!phoneNumber) errors.phoneNumber = 'Phone number is required.';
    if (!password) errors.password = 'Password is required.';
    if (!dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';

    const emailRegex = /\S+@\S+\.\S+/;
    if (email && !emailRegex.test(email)) errors.email = 'Invalid email format.';

    if (password.length > 0 && password.length < 6) errors.password = 'Password must be at least 6 characters.';

    // Validate Date of Birth (Format: MM/DD/YYYY)
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    if (dateOfBirth && !dobRegex.test(dateOfBirth)) errors.dateOfBirth = 'Format must be MM/DD/YYYY.';

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔹 Handle Sign-Up with Supabase
  const handleSignUp = async () => {
    console.log("🟡 Register button clicked!");

    if (!validateInputs()) {
      console.log("❌ Input validation failed!");
      return;
    }

    setLoading(true);
    console.log("🟡 Sending request to Supabase...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            date_of_birth: dateOfBirth, // Saves as MM/DD/YYYY string
            phone_number: phoneNumber,
          },
        },
      });

      console.log("🟡 Supabase response:", data, error);

      if (error) {
        console.log("❌ Supabase Error:", error.message);
        setErrorMessages({ general: error.message }); // Display API error
        setLoading(false);
        return;
      }

      console.log("✅ Sign-Up Successful! Redirecting...");
      setErrorMessages({});
      router.replace('/LoginScreen'); // Ensure this path is correct
    } catch (err) {
      console.log("❌ Error Occurred:", err);
      setErrorMessages({ general: 'An unexpected error occurred. Try again.' });
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.label}>Date of Birth (MM/DD/YYYY)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={dateOfBirth}
          onChangeText={(text) => {
            setDateOfBirth(text);
            setErrorMessages((prev) => ({ ...prev, dateOfBirth: '' }));
          }}
        />
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
        {errorMessages.password && <Text style={styles.errorText}>{errorMessages.password}</Text>}
      </View>

      {errorMessages.general && <Text style={styles.errorText}>{errorMessages.general}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
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
