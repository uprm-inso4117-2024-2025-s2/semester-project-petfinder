import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [requiresOtp, setRequiresOtp] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);

        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password, // No need to hash the password manually
        });

        if (error) {
            Alert.alert("Login Failed", error.message);
            setLoading(false);
            return;
        }

        // Check for two-factor authentication (if applicable)
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, two_factor_enabled")
            .eq("email", email)
            .single();

        if (userError) {
            Alert.alert("Login Failed", userError.message);
            setLoading(false);
            return;
        }

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
        const { data, error } = await supabase.rpc("validate_otp", { user_id: user.id, otp });

        if (error) {
            Alert.alert("Invalid OTP", error.message);
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

            <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {!requiresOtp ? (
                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <TextInput
                        placeholder="Enter OTP"
                        style={styles.input}
                        keyboardType="numeric"
                        value={otp}
                        onChangeText={setOtp}
                    />

                    <TouchableOpacity onPress={verifyOtp} style={styles.verifyButton}>
                        <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity style={styles.googleButton}>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/signup")}>
                    <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
            </View>
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
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "#16A849",
        fontSize: 14,
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
    verifyButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    verifyButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    googleButton: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#cccccc",
        marginBottom: 20,
    },
    googleButtonText: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "bold",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    signupText: {
        color: "#666666",
        fontSize: 14,
    },
    signupLink: {
        color: "#16A849",
        fontSize: 14,
        fontWeight: "bold",
    },
});
