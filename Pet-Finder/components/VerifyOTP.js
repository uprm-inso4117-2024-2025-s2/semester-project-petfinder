import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import api from "../utils/api";

const VerifyOTP = ({ userId, method }) => {
  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {
    const response = await api.post("/verify-otp", { userId, otp, method });

    if (response.success) {
      Alert.alert("Success", "Login Verified!");
    } else {
      Alert.alert("Error", "Invalid OTP. Try Again.");
    }
  };

  return (
    <View>
      <Text>Enter OTP:</Text>
      <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <Button title="Verify OTP" onPress={verifyOTP} />
    </View>
  );
};

export default VerifyOTP;
