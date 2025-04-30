import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.replace("/ReportScreen"); // Adjust this route
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6b4c2e"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6b4c2e"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggle}
          >
            <Text style={{ color: "#6b4c2e" }}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <TouchableOpacity
          onPress={() => router.push("/ForgotScreen")}
          style={styles.forgotLink}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/SignUp")}
          style={styles.signupLink}
        >
          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text style={styles.signupHighlight}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#faf0dc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4e3620",
    textAlign: "center",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
    position: "relative",
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderColor: "#d6c0a5",
    borderWidth: 1,
    fontSize: 16,
    color: "#4e3620",
  },
  toggle: {
    position: "absolute",
    right: 12,
    top: 14,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  linkText: {
    color: "#6b4c2e",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#6b431f",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderColor: "#6b4c2e",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  googleText: {
    color: "#6b4c2e",
    fontWeight: "600",
  },
  signupLink: {
    alignItems: "center",
  },
  signupText: {
    color: "#4e3620",
  },
  signupHighlight: {
    fontWeight: "bold",
    color: "#6b431f",
  },
});
