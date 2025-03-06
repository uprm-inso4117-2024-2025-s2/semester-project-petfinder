import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LandingPage() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem("userSession");
        router.replace("/login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Pet Finder!</Text>
            <Text style={styles.subtitle}>Find your perfect pet today</Text>

            <TouchableOpacity
                onPress={() => router.push("/login")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/signup")}
                style={[styles.button, styles.signUpButton]}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: "#777",
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 5,
        width: "80%",
        marginBottom: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    signUpButton: {
        backgroundColor: "#2196F3",
    },
    logoutButton: {
        backgroundColor: "red",
    },
});