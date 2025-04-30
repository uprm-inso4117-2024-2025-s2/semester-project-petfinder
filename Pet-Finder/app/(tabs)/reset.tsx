import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase"; // NOTE: Adjusted for correct relative path

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (error) {
      Alert.alert("Reset Failed", error.message);
    } else {
      Alert.alert(
        "Success",
        "Password reset link sent! Please check your inbox."
      );
      router.replace("/"); // ✅ Adjust if your login is under a different route
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handlePasswordReset}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backText}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  backLink: {
    marginTop: 20,
  },
  backText: {
    color: "#3498db",
    fontSize: 14,
    textDecorationLine: "underline",
  },
};
