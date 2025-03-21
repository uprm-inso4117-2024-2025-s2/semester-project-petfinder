import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";
import QRCode from "react-native-qrcode-svg";
import { nanoid } from "nanoid"; // Generates a secure random secret

export default function Enable2FAScreen() {
    const [totpSecret, setTotpSecret] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Fetch authenticated user when screen loads
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                Alert.alert("Error", "Failed to fetch user.");
                setLoading(false);
                return;
            }
            setUser(data.user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    // 🔹 Generate a secure TOTP secret and store it in Supabase
    const generateTOTPSecret = async () => {
        if (!user) {
            Alert.alert("Error", "User not found. Please log in.");
            return;
        }

        // Generate a random base32 secret (compatible with Google Authenticator)
        const secret = nanoid(32);
        setTotpSecret(secret);

        const { error } = await supabase
            .from("users")
            .update({ two_factor_enabled: true, two_factor_method: "totp", totp_secret: secret })
            .eq("id", user.id);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "2FA Enabled! Scan the QR code with Google Authenticator.");
        }
    };

    // 🔹 Generate a QR Code for Google Authenticator
    const getQRCodeURI = () => {
        if (!totpSecret || !user?.email) return "";
        return `otpauth://totp/PetFinder:${user.email}?secret=${totpSecret}&issuer=PetFinder`;
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Enable Two-Factor Authentication</Text>

            <TouchableOpacity
                onPress={generateTOTPSecret}
                style={{ backgroundColor: "blue", padding: 10, borderRadius: 5, marginBottom: 20 }}
            >
                <Text style={{ color: "white" }}>Enable TOTP 2FA</Text>
            </TouchableOpacity>

            {totpSecret && (
                <>
                    <Text style={{ marginTop: 20 }}>Scan this QR Code:</Text>
                    <QRCode value={getQRCodeURI()} size={200} />
                </>
            )}
        </View>
    );
}
