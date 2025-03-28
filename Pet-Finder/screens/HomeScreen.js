import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem("userSession");
        navigation.replace("Login");
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Welcome!</Text>

            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    backgroundColor: "red",
                    padding: 12,
                    borderRadius: 5,
                    width: "80%",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
