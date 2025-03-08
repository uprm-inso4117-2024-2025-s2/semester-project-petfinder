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

    // 🔹 Handles user login
    const handleLogin = async () => {
        console.log("🟡 Attempting login...");
        setLoading(true);
        setErrorMessage(""); // Clear any previous error messages
    
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
    
            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }
    
            // Fetch authenticated user
            const { data: userData, error: userError } = await supabase.auth.getUser();
    
            if (userError) {
                setErrorMessage("Could not fetch user details.");
                setLoading(false);
                return;
            }
    
            // Check if 2FA is enabled
            const { data: userDetails } = await supabase
                .from("users")
                .select("id, two_factor_enabled, two_factor_method")
                .eq("id", userData.user.id)
                .single();
    
            if (userDetails?.two_factor_enabled) {
                setRequiresOtp(true);
                return;
            }
    
            // ✅ Login Success, Redirect
            router.replace("/(tabs)/");
        } catch (err) {
            setErrorMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    const verifyOtp = async () => {
        setLoading(true);
    
        const { data, error } = await supabase.rpc("validate_otp", { user_id: user.id, otp });
    
        if (error) {
            setErrorMessage("Invalid OTP. Please try again.");
            setOtp("");
            setLoading(false);
            return;
        }
    
        router.replace("/(tabs)/");
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>PetFinder</Text>
            <Text style={styles.title}>Sign in to your Account</Text>
            <Text style={styles.subtitle}>Enter your email and password to log in</Text>

            {/* Email Input */}
            <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Input */}
            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* 🔴 Display Error Message Here */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Log In</Text>}
            </TouchableOpacity>
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

