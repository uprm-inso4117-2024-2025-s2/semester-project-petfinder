import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import { Buffer } from "buffer"; // For binary conversion
import { useRouter } from "expo-router";

import { supabase } from "../../lib/supabase"; // Adjust path as needed
import ProfileImagePlaceholder from "../../assets/images/profileImageplaceholder.jpeg";

// Define State Machine States
type ProfileState =
  | "LOADING"
  | "VIEW"
  | "EDIT"
  | "SAVING"
  | "SUCCESS"
  | "ERROR";

// Hard-coded user email
const HARD_CODED_EMAIL = "eve@example.com";

export default function ProfileScreen() {
  const router = useRouter();
  const [profileState, setProfileState] = useState<ProfileState>("LOADING");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Our local user data
  const [user, setUser] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
  });

  // 1. Fetch user data from Supabase for "eve@example.com"
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", HARD_CODED_EMAIL)
          .single();

        if (userError || !userData) {
          throw new Error(userError?.message || "No user found");
        }

        // Populate local state
        setUser({
          name: userData.full_name || "",
          email: userData.email || "",
          dob: userData.dob || "",
          phone: userData.phone || "",
        });

        // If they have an existing profile image URL, store it in state
        setProfileImage(userData.profile_image_url ?? null);
        setProfileState("VIEW"); // Show the profile
      } catch (error) {
        console.error("Error fetching user:", error);
        setProfileState("ERROR");
      }
    };

    fetchUserData();
  }, []);

  // A small helper to handle text field changes
  const handleChange = (field: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // 2. Open image picker and upload a new profile image
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const asset = result.assets[0];
        setProfileImage(asset.uri);
  
        setProfileState("SAVING");
  
        const fileUri = asset.uri;
        const fileExt = fileUri.split(".").pop();
        const fileName = `profile-${Date.now()}.${fileExt}`;
        const mimeType = mime.getType(fileUri) || "image/jpeg";
  
        // Convert image to binary format
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        // Upload image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images") // Ensure this bucket exists
          .upload(fileName, Buffer.from(fileBase64, "base64"), {
            contentType: mimeType,
            upsert: true, // Overwrite if needed
          });
  
        if (uploadError) throw new Error(uploadError.message);
  
        console.log("Uploaded:", uploadData);
  
        // 🔥 Retrieve the **public URL** of the uploaded image
        const { data } = supabase.storage.from("profile-images").getPublicUrl(fileName);
        const imageUrl = data.publicUrl;
  
        if (!imageUrl) throw new Error("Failed to retrieve public URL");
  
        // 3. **Update the user's `profile_image_url` in Supabase**
        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_image_url: imageUrl })
          .eq("id", supabase.auth.user()?.id); // Match by authenticated user ID
  
        if (updateError) throw new Error(updateError.message);
  
        // Update local state so the new image shows
        setProfileImage(imageUrl);
        setProfileState("VIEW");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Image upload failed!");
      setProfileState("ERROR");
    }
  };

  // 4. Save any edited name/phone/dob changes
  const handleSaveChanges = async () => {
    try {
      setProfileState("SAVING");

      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: user.name,
          phone: user.phone,
          dob: user.dob,
        })
        .eq("email", HARD_CODED_EMAIL);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setProfileState("VIEW"); // Done saving
    } catch (error) {
      console.error("Error saving profile:", error);
      setProfileState("ERROR");
    }
  };

  // Show a loading indicator if still loading
  if (profileState === "LOADING") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render the Profile Screen
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

      {/* Profile Image + Camera Icon */}
      <View style={styles.profileContainer}>
        <Image
          source={
            profileImage ? { uri: profileImage } : ProfileImagePlaceholder
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="camera" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Editable Fields */}
      <TextInput
        style={[styles.input, profileState === "EDIT" && styles.editable]}
        value={user.name}
        onChangeText={(text) => handleChange("name", text)}
        editable={profileState === "EDIT"}
        placeholder="Full Name"
      />

      <TextInput
        style={[styles.input, profileState === "EDIT" && styles.editable]}
        value={user.dob}
        onChangeText={(text) => handleChange("dob", text)}
        editable={profileState === "EDIT"}
        placeholder="Date of Birth"
      />

      <TextInput
        style={[styles.input, profileState === "EDIT" && styles.editable]}
        value={user.phone}
        onChangeText={(text) => handleChange("phone", text)}
        editable={profileState === "EDIT"}
        placeholder="Phone"
      />

      {/* Toggle between View and Edit Mode */}
      {profileState === "VIEW" ? (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setProfileState("EDIT")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* --------------- STYLES --------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#16A849",
    borderRadius: 20,
    padding: 6,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
  },
  editable: {
    borderColor: "#16A849",
    borderWidth: 2,
  },
  editButton: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editText: {
    color: "white",
    fontWeight: "bold",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});
