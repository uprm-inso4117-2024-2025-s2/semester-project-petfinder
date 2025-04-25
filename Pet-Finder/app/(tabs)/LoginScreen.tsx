import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { User } from "@supabase/supabase-js";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [requiresOtp, setRequiresOtp] = useState<boolean>(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();
  const { login } = useAuth();

  // Check if we already have a session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user && !error) {
        login(data.session.user);
        router.replace("/(tabs)/");
      }
    };
    
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Log the attempt
      console.log(`Attempting to sign in user: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      console.log("Sign in response:", data ? "Data received" : "No data", error ? `Error: ${error.message}` : "No error");

      if (error) {
        console.error("Full login error:", error);
        if (error.message.includes("invalid")) {
          setErrorMessage("Invalid email or password");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (!data.user || !data.session) {
        setErrorMessage("Login successful but no user data returned");
        return;
      }

      // Check if 2FA is enabled
      const twoFactorEnabled = data.user?.user_metadata?.two_factor_enabled === true;
      console.log("2FA enabled:", twoFactorEnabled);

      if (twoFactorEnabled) {
        setRequiresOtp(true);
        setTempUser(data.user);
      } else {
        // Direct login if no 2FA
        await login(data.user);
        router.replace("/(tabs)/");
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      setErrorMessage(error?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setErrorMessage("Please enter the OTP");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
  
    try {
      console.log(`Attempting to verify OTP for user ID: ${tempUser?.id}`);
      
      // Make sure the RPC exists in your Supabase project
      const { data: otpData, error: otpError } = await supabase.rpc("validate_otp", {
        user_id: tempUser?.id,
        otp_code: otp, // Make sure parameter name matches your RPC function
      });
  
      console.log("OTP validation response:", otpData, otpError);
      
      if (otpError) {
        console.error("OTP validation error:", otpError);
        setErrorMessage("Invalid OTP. Please try again.");
        return;
      }
  
      // After successful OTP validation, get a new session
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error after OTP:", sessionError);
        setErrorMessage("Failed to get session after OTP verification");
        return;
      }
  
      if (data?.session?.user) {
        await login(data.session.user);
        router.replace("/(tabs)/");
      } else {
        setErrorMessage("Session expired. Please log in again.");
        setRequiresOtp(false);
      }
    } catch (error: any) {
      console.error("Full OTP error:", error);
      setErrorMessage(error?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Alternative simplified approach if your custom RPC doesn't work
  const handleLoginWithoutOtp = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;
      
      if (data.user && data.session) {
        await login(data.user);
        router.replace("/(tabs)/");
      } else {
        setErrorMessage("No user data returned");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {!requiresOtp ? (
        <>
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text: string) => setEmail(text)}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(text: string) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/reset")}
            style={styles.forgotPassword}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.otpText}>
            A one-time password has been sent to your authentication app.
          </Text>
          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            keyboardType="numeric"
            value={otp}
            onChangeText={(text: string) => setOtp(text)}
          />
          <TouchableOpacity
            onPress={verifyOtp}
            style={styles.otpButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRequiresOtp(false)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  linkText: {
    color: "#3498db",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#16A849",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  otpButton: {
    backgroundColor: "#16A849",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  backButtonText: {
    color: "#3498db",
    fontSize: 16,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  otpText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333333",
  },
});