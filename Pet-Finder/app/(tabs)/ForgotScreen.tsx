import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [inputErrors, setInputErrors] = useState({
    email: false,
  });

  const router = useRouter();

  const handleResetPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setInputErrors({ email: false });

    // Validate email
    if (!email) {
      setInputErrors(prev => ({ ...prev, email: true }));
      setErrorMessage('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInputErrors(prev => ({ ...prev, email: true }));
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'your-app://reset-password', // Replace with your deep link
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('Password reset link sent to your email!');
      setEmail('');
    } catch (error) {
      setErrorMessage("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password
        </Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          style={[
            styles.input,
            inputErrors.email && styles.inputError
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Email input for password reset"
        />

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorText} accessibilityLiveRegion="assertive">
            {errorMessage}
          </Text>
        ) : null}

        {/* Success Message */}
        {successMessage ? (
          <Text style={styles.successText} accessibilityLiveRegion="assertive">
            {successMessage}
          </Text>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.button}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Link */}
        <TouchableOpacity
          onPress={() => router.replace("/LoginScreen")}
          style={styles.backLink}
          accessibilityRole="link"
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#FFF0F0',
  },
  button: {
    backgroundColor: '#16A849',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  backLink: {
    alignSelf: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});