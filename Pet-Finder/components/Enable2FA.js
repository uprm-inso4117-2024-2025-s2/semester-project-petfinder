import React, { useState } from "react";
import { View, Text, Button, Alert, Image, TextInput } from "react-native";
import api from "../utils/api"; // Import API utility for backend requests

const Enable2FA = ({ userId }) => {
  const [method, setMethod] = useState(null);
  const [qrCode, setQrCode] = useState("");

  const enable2FA = async (type) => {
    setMethod(type);

    if (type === "email") {
      await api.post("/enable-2fa", { userId, method: "email" });
      Alert.alert("Success", "2FA enabled via Email!");
    } else if (type === "authenticator") {
      const response = await api.post("/enable-authenticator", { userId });
      setQrCode(response.qrCode);
    }
  };

  return (
    <View>
      <Text>Enable Two-Factor Authentication (2FA)</Text>
      <Button title="Enable via Email OTP" onPress={() => enable2FA("email")} />
      <Button title="Enable via Google Authenticator" onPress={() => enable2FA("authenticator")} />

      {qrCode ? (
        <>
          <Text>Scan this QR Code with Google Authenticator:</Text>
          <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />
        </>
      ) : null}
    </View>
  );
};

export default Enable2FA;
