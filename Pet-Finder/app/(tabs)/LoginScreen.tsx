import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard 
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [user, setUser] = useState<any>(null);
  // 🔴 New State Additions
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
    otp: false
  });

  const router = useRouter();

  // 🔴 Modified handleLogin with better error handling
  const handleLogin = async () => {
    setErrorMessage("");
    setInputErrors({ email: false, password: false, otp: false });
    
    // Basic validation
    if (!email) {
      setInputErrors(prev => ({...prev, email: true}));
      setErrorMessage("Email is required");
      return;
    }
    
    if (!password) {
      setInputErrors(prev => ({...prev, password: true}));
      setErrorMessage("Password is required");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setErrorMessage(error.message);
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
        router.replace("/Enable2FAScreen");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Modified verifyOtp with better error handling
  const verifyOtp = async () => {
    if (!otp) {
      setInputErrors(prev => ({...prev, otp: true}));
      setErrorMessage("OTP is required");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("validate_otp", {
        user_id: user.id,
        otp,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace("/ReportScreen");
    } catch (error) {
      setErrorMessage("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          style={[
            styles.input,
            inputErrors.email && styles.inputError
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Email input"
        />

        {/* Password Input with Toggle */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={[
              styles.input,
              inputErrors.password && styles.inputError
            ]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password input"
          />
          <TouchableOpacity 
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Text>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message Display */}
        {errorMessage ? (
          <Text style={styles.errorText} accessibilityLiveRegion="assertive">
            {errorMessage}
          </Text>
        ) : null}

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={() => router.push("/ForgotScreen")}
          style={styles.forgotPassword}
          accessibilityLabel="Forgot password"
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login/OTP Section */}
        {!requiresOtp ? (
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              placeholder="Enter OTP"
              style={[
                styles.input,
                inputErrors.otp && styles.inputError
              ]}
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              accessibilityLabel="OTP input"
            />

            <TouchableOpacity
              onPress={verifyOtp}
              style={styles.verifyButton}
              disabled={loading}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={() => router.push("/SignUp")}
          style={styles.signupLink}
          accessibilityRole="link"
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupHighlight}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // 🔴 Original Styles
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
    marginBottom: 10,
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
  
  // 🔴 New Styles
  inputError: {
    borderColor: 'red',
    backgroundColor: '#FFF0F0'
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative'
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
    padding: 10
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 15
  },
  linkText: {
    color: "#3498db",
    textDecorationLine: "underline"
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  signupLink: {
    marginTop: 20
  },
  signupText: {
    color: '#666',
    textAlign: 'center'
  },
  signupHighlight: {
    color: '#3498db',
    fontWeight: 'bold'
  }
});