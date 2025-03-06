import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { StyleSheet } from 'react-native';


const LandingPage = ({ navigation }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.replace("Login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Pet Finder!</Text>
            <Text style={styles.subtitle}>Find your perfect pet easily</Text>
            
            {/* Login Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
                style={[styles.button, styles.signUpButton]}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Optional: Logout Button for testing */}
            <TouchableOpacity
                onPress={handleLogout}
                style={[styles.button, styles.logoutButton]}
            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        backgroundColor: "#2196F3", // Different color for SignUp button
    },
    logoutButton: {
        backgroundColor: "red", // For testing logout functionality
    },
});

export default LandingPage;
