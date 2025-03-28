import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            Alert.alert("Login Failed", error.message);
        } else {
            await AsyncStorage.setItem("userSession", JSON.stringify(user));
            navigation.replace("Home");
        }

        setLoading(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

            <TextInput
                placeholder="Email"
                style={{
                    width: "100%",
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                style={{
                    width: "100%",
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                onPress={handleLogin}
                style={{
                    backgroundColor: "#3498db",
                    padding: 12,
                    borderRadius: 5,
                    width: "100%",
                    alignItems: "center",
                }}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={{ marginTop: 15 }}>
                <Text style={{ color: "#3498db" }}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
