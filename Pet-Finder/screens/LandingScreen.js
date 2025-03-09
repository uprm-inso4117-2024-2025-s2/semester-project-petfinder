import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { StyleSheet } from 'react-native';


const LandingPage = ({ navigation }) => {

    return (

        <ParallaxScrollView
              headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
              headerImage={
                <Image
                  // source={require('@/assets/images/partial-react-logo.png')}
                  source={require('@/assets/images/pet_finder_logo_middle.jpeg')}
                  style={styles.reactLogo}
                />
              }>

        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Pet Finder!</Text>
            <Text style={styles.subtitle}>Find your perfect pet easily</Text>
            
            {/* Login Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
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
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6b431f",
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
        backgroundColor: "#2196F3", // Different color for SignUp button
    },
});

export default LandingPage;
