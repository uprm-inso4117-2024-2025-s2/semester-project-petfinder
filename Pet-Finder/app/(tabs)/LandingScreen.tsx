import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function LandingPage() {
    const router = useRouter();

    return (

        <View style={styles.container}>
            
            {/* source={require('@/assets/images/pet_finder_logo_middle.jpeg')}
            style={styles.logo} */}
        
            <Text style={styles.title}>Welcome to Pet Finder!</Text>
            <Text style={styles.subtitle}>Find your perfect pet today</Text>

            <TouchableOpacity
                onPress={() => router.push("/LoginScreen")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/SignupScreen")} // A SignupScreen is needed fo this button to work
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
        backgroundColor: "#faf0dc",
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
        color: "#000",
    },
    button: {
        backgroundColor: "#6b431f",
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
        backgroundColor: "#6b431f",
    },
    logo: {
        width: 350,  
        height: 500, 
        marginBottom: 20, 
        left: 0,
    },
});