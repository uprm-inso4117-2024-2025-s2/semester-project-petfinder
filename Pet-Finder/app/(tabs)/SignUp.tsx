import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/LoginScreen');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the pet finder community</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#a68d7e"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#a68d7e"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleSignUp}
        style={styles.signupButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signupText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/LoginScreen')}>
        <Text style={styles.loginRedirect}>
          Already have an account? <Text style={styles.loginBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf0dc',
    padding: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5b3a29',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7b5e4b',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#fdf7ef',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#3b2c22',
    borderWidth: 1.5,
    borderColor: '#decbb3',
  },
  signupButton: {
    backgroundColor: '#7b4e2e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupText: {
    color: '#fff8f2',
    fontWeight: '600',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#fefcf9',
    borderColor: '#b59176',
    borderWidth: 1.4,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  googleText: {
    color: '#5b3a29',
    fontWeight: '600',
    fontSize: 15,
  },
  loginRedirect: {
    textAlign: 'center',
    color: '#7b5e4b',
    fontSize: 14,
  },
  loginBold: {
    fontWeight: 'bold',
    color: '#5b3a29',
  },
});
