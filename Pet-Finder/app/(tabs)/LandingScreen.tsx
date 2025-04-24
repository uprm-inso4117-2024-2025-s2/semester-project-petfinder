import React from "react"; 
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('@/assets/images/pet_finder_logo_middle.jpeg')} style={styles.headerImage} />
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => router.push("/LoginScreen")} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/SignUp")} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Body of Landing Page */}
            <ScrollView contentContainerStyle={styles.content} style={styles.scrollView}>
                <Image 
                    source={require('@/assets/images/pet_finder_logo_middle.jpeg')} 
                    style={styles.logo} 
                />
                
                <Text style={styles.title}>Welcome to Pet Finder!</Text>
                <Text style={styles.subtitle}>Find your perfect pet today</Text>
                
                {/* Trial Section */}
                <View style={styles.trialSection}>
                    <Text style={styles.trialTitle}>Our Mission!</Text>
                    <Text style={styles.trialText}>At Pet Finder, our mission is simple: to find lost pets and reunite them with their owners. 
                        We understand the emotional journey of losing a beloved pet, and we are dedicated to helping families
                        bring their pets home safely. By connecting lost pets with their rightful owners, we make sure that 
                        every pet has a second chance to be reunited with the people who love them.</Text>
                    <TouchableOpacity onPress={() => router.push("/LoginScreen")} style={styles.trialButton}>
                        <Text style={styles.trialButtonText}>Join Us!</Text>
                    </TouchableOpacity>
                </View>

                {/* Success Stories */}
                <View style={styles.successStories}>
                    <Text style={styles.successTitle}>Happy Reunions!</Text>

                    <View style={styles.storyCard}>
                        <Text style={styles.storyText}>
                            "After a week of searching, we found Luna through Pet Finder. Thank you for giving us hope!" 
                            - María from Bayamón
                        </Text>
                    </View>

                    <View style={styles.storyCard}>
                        <Text style={styles.storyText}>
                            "We thought Max was gone forever... but someone spotted him and pinned his location! We're so grateful to be able to find him!" 
                            - José & Carla
                        </Text>
                    </View>

                    <View style={styles.storyCard}>
                        <Text style={styles.storyText}>
                            "We were devastated when Coco ran off during a storm. Thanks to this app, a kind stranger found her!" 
                            - Luis from Ponce
                        </Text>
                    </View>

                    <View style={styles.storyCard}>
                        <Text style={styles.storyText}>
                            "I never imagined finding Toby again, but Pet Finder made the impossible happen. Forever grateful!" 
                            - Gabriela R.
                        </Text>
                    </View>

                    <View style={styles.storyCard}>
                        <Text style={styles.storyText}>
                            "Bruno was missing for 3 days, but someone posted his picture and we were able to contact them. This app works miracles!" 
                            - The Santiago Family
                        </Text>
                    </View>
                </View>


                {/* Footer inside ScrollView */}
                <View style={styles.footer}>
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerLink}>Contact Us</Text>
                        <Text style={styles.footerLink}>Success Stories</Text>
                        <Text style={styles.footerLink}>Resources</Text>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                    </View>
                    <Text style={styles.footerText}>© 2025 Pet Finder. All rights reserved.</Text>
                    <Text style={styles.footerText}>Made with ❤️ by Team Pet Finder</Text>
                    <Text style={styles.footerText}>Version 1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf0dc",
    },
    header: {
        width: "100%",
        padding: 20,
        backgroundColor: "#FBF0DC",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 50,
    },
    headerImage: {
        width: 75,
        height: 75,
        marginLeft: 15,
    },
    headerButtons: {
        flexDirection: "row",
    },
    headerButton: {
        backgroundColor: "#6b431f",
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    headerButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    content: {
        flexGrow: 1,  // Ensures content takes up available space
        justifyContent: "center",
        alignItems: "center",
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
    trialSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#e8d8c4",
        borderRadius: 10,
        alignItems: "center",
    },
    trialTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    trialText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
    },
    trialButton: {
        backgroundColor: "#6b431f",
        padding: 10,
        borderRadius: 5,
    },
    trialButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    logo: {
        width: 300,  
        height: 300, 
        marginBottom: 20, 
    },
    footer: {
        width: "150%",
        padding: 15,
        backgroundColor: "#6b431f",
        alignItems: "center",
        marginTop: 20,  // added some space between content and footer
    },
    footerLinks: {
        marginBottom: 10, // space between links and copyright text
    },
    footerLink: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 5,
        textAlign: "center",
    },
    footerText: {
        color: "#fff",
        fontSize: 14,
    },
    additionalContent: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#e8d8c4",
        borderRadius: 10,
        alignItems: "center",
    },
    additionalText: {
        fontSize: 16,
        textAlign: "center",
    },
    scrollView: {
        paddingBottom: 100, // Add extra space at the bottom to avoid covering by bottom navigation menu
    },
    successStories: {
        marginTop: 30,
        padding: 15,
        backgroundColor: "#e8d8c4",
        borderRadius: 10,
        alignItems: "center",
    },
    successTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    storyCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        width: "100%",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    storyText: {
        fontSize: 14,
        color: "#333",
        fontStyle: "italic",
    },
    
});
