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
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import ProfileImagePlaceholder from "../../assets/images/profileImageplaceholder.jpeg";

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#6b431f" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#6b431f" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : ProfileImagePlaceholder}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="camera" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.name, isEditing && styles.editable]}
        value={user.name}
        onChangeText={(text) => handleChange("name", text)}
        editable={isEditing}
      />

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
            color={isEditing ? "#6b431f" : "gray"}
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
              color={isEditing ? "#6b431f" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf0dc",
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
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#c2b59b",
  },
  editIcon: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#6b431f",
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6b431f",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#6b431f",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c2b59b",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c2b59b",
    justifyContent: "space-between",
  },
  inputField: {
    fontSize: 16,
  },
  editable: {
    borderWidth: 2,
    borderColor: "#6b431f",
    backgroundColor: "#f9f5ef",
    paddingHorizontal: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#6b431f",
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
    borderColor: "#6b431f", 
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#6b431f", 
    fontWeight: "bold",
  },
});