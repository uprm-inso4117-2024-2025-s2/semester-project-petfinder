import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [user, setUser] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState(""); // 🔴 New State for Error Messages
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert("Login Failed", error.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("id, two_factor_enabled, two_factor_method")
      .eq("id", data.user.id)
      .single();

    if (userData?.two_factor_enabled) {
      setRequiresOtp(true);
      setUser(userData);
    } else {
      router.replace("/(tabs)/");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("validate_otp", {
      user_id: user.id,
      otp,
    });

    if (error) {
      Alert.alert("Invalid OTP", error.message);
      setLoading(false);
      return;
    }

    router.replace("/(tabs)/");
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        style={{
          width: "100%",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={{
          width: "100%",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/reset")}
        style={{ alignSelf: "flex-end", marginBottom: 15 }}
      >
        <Text style={{ color: "#3498db", textDecorationLine: "underline" }}>Forgot Password?</Text>
      </TouchableOpacity>

      {!requiresOtp ? (
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: "#3498db",
            padding: 12,
            borderRadius: 5,
            width: "100%",
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            placeholder="Enter OTP"
            style={{
              width: "100%",
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
            }}
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            onPress={verifyOtp}
            style={{
              backgroundColor: "green",
              padding: 12,
              borderRadius: 5,
              width: "100%",
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#ffffff",
    },
    appTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#81C090",
        textAlign: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666666",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#cccccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
        color: "#333333",
    },
    loginButton: {
        backgroundColor: "#16A849",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red", // 🔴 Makes Error Message Red
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10,
    },
});

