import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [user, setUser] = useState({
    name: "Student Name",
    email: "manuellopez@upr.edu",
    dob: "18/03/2024",
    phone: "(454) 726-0592",
    password: "********",
  });

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://i.imgur.com/4u1lxaA.png" }}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
            name={isEditing ? "checkmark-circle" : "pencil"}
            size={22}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* User Name */}
      <TextInput
        style={[styles.name, isEditing && styles.editable]}
        value={user.name}
        onChangeText={(text) => handleChange("name", text)}
        editable={isEditing}
      />

      {/* Editable Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, isEditing && styles.editable]}
          value={user.email}
          onChangeText={(text) => handleChange("email", text)}
          editable={isEditing}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <View style={[styles.inputWithIcon, isEditing && styles.editable]}>
          <TextInput
            style={[styles.inputField, { flex: 1 }]}
            value={user.dob}
            onChangeText={(text) => handleChange("dob", text)}
            editable={isEditing}
          />
          <Ionicons
            name="calendar-outline"
            size={20}
            color={isEditing ? "black" : "gray"}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, isEditing && styles.editable]}
          value={user.phone}
          onChangeText={(text) => handleChange("phone", text)}
          editable={isEditing}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWithIcon, isEditing && styles.editable]}>
          <TextInput
            style={[styles.inputField, { flex: 1 }]}
            value={user.password}
            secureTextEntry={!passwordVisible}
            editable={isEditing}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isEditing ? "black" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      {isEditing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  editIcon: {
    bottom: 30,
    left: 45,
    backgroundColor: "#16A849",
    borderRadius: 20,
    padding: 6,
    elevation: 3, // Adds slight shadow
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1, // Default border
    borderColor: "#E0E0E0", // Light border when not editing
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "space-between",
  },
  inputField: {
    fontSize: 16,
  },
  editable: {
    borderWidth: 2, // Thicker border when editing
    borderColor: "#16A849", // Green border to indicate active editing
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontWeight: "bold",
  },
});