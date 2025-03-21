import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";

export default function ReportPetScreen() {
  // Common state fields
  const [petStatus, setPetStatus] = useState<"lost" | "found">("lost");
  const [petName, setPetName] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [dateTime, setDateTime] = useState(""); // Display string
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  // For both Lost and Found, we now use separate contact fields:
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Additional field for Found reports
  const [petCondition, setPetCondition] = useState<"" | "in my custody" | "roaming" | "deceased">("");

  const router = useRouter();

  // Photo picking logic using Expo ImagePicker
  const handlePhotoUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera roll permissions are needed to upload a photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // using deprecated API if necessary
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while picking an image.");
    }
  };

  // Simple function to remove the photo
  const handleRemovePhoto = () => {
    setPhotoUri(null);
  };

  const handleGoBackHome = () => {
    router.replace("HomeScreen");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    setDateTime(date.toLocaleString());
    hideDatePicker();
  };

  const handleSubmit = () => {
    // Validate common fields
    if (!lastSeenLocation) {
      Alert.alert("Required Field Missing", "Please fill out the Last Seen Location.");
      return;
    }
    if (!dateTime) {
      Alert.alert("Required Field Missing", "Please pick the Last Seen Date and Time.");
      return;
    }
    if (!contactName || !contactPhone || !contactEmail) {
      Alert.alert(
        "Required Field Missing",
        "Please fill out your Contact Information (Name, Phone, Email)."
      );
      return;
    }

    if (petStatus === "lost") {
      // Lost Pet validations
      if (!petName) {
        Alert.alert("Required Field Missing", "Please fill out the Pet Name.");
        return;
      }
      if (!description) {
        Alert.alert("Required Field Missing", "Please fill out the Description.");
        return;
      }
    } else {
      // Found Pet validations
      if (!petCondition) {
        Alert.alert("Required Field Missing", "Please select the Pet Condition.");
        return;
      }
    }

    const formData = {
      petStatus,
      petName,
      lastSeenLocation,
      dateTime,
      photoUri,
      description,
      petCondition: petStatus === "found" ? petCondition : null,
      contactName,
      contactPhone,
      contactEmail,
    };

    console.log("Form Data:", formData);
    Alert.alert("Submitted!", "Your report has been submitted.");
  };

  // Simple function to show a tooltip Alert
  const showTooltip = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return (
    <View style={styles.screenContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBackHome}>
            <Image
              source={require("../../assets/images/Pet_Finder_Assets/arrow.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Image
            source={require("../../assets/images/Pet_Finder_Assets/Pet_Logo.png")}
            style={styles.headerImage}
          />
        </View>
        <View style={styles.alarmContainer}>
          <Image
            source={require("../../assets/images/Pet_Finder_Assets/alarm.png")}
            style={styles.alarmImage}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {petStatus === "lost" ? "Report a Lost Pet" : "Report a Found/Stray Pet"}
          </Text>
        </View>

        {/* Pet Status */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            Pet Status (Required)
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Pet Status",
                  petStatus === "lost"
                    ? "Must select 'Lost' for lost pet reports."
                    : "Must select 'Found/Stray' for found pet reports."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setPetStatus("lost")}>
              <View style={[styles.radioCircle, petStatus === "lost" && styles.selectedCircle]} />
              <Text style={styles.radioText}>Lost</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setPetStatus("found")}>
              <View style={[styles.radioCircle, petStatus === "found" && styles.selectedCircle]} />
              <Text style={styles.radioText}>Found/Stray</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet Name */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            {petStatus === "lost" ? "Pet Name (Required)" : "Pet Name (Optional)"}
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Pet Name",
                  petStatus === "lost"
                    ? "Enter the name of the lost pet."
                    : "If known, enter the name of the found pet."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <TextInput
            style={styles.boxInput}
            placeholder="Enter pet name"
            placeholderTextColor="#A9A9AC"
            value={petName}
            onChangeText={setPetName}
          />
        </View>

        {/* Last Seen Location */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            Last Seen Location (Required)
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Last Seen Location",
                  petStatus === "lost"
                    ? "Enter the nearest landmark, address, or GPS coordinates where the pet was last seen."
                    : "Enter the location where the pet was found."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <TextInput
            style={styles.boxInput}
            placeholder="Enter location"
            placeholderTextColor="#A9A9AC"
            value={lastSeenLocation}
            onChangeText={setLastSeenLocation}
          />
        </View>

        {/* Last Seen Date and Time */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            Last Seen Date and Time (Required)
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Last Seen Date and Time",
                  "Select the exact or approximate date and time the pet was last seen or found."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
            <Text style={styles.dateButtonText}>
              {dateTime ? dateTime : "Pick Date and Time"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>

        {/* Photo Upload */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            Photo of the Pet (Optional)
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Photo",
                  "Select a clear image of the pet for identification purposes."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <TouchableOpacity style={styles.addPhotoButton} onPress={handlePhotoUpload}>
            <Text style={styles.addPhotoButtonText}>Add Photo</Text>
          </TouchableOpacity>
          {photoUri && (
            <>
              <Image
                source={{ uri: photoUri }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              />
              <TouchableOpacity style={styles.removePhotoButton} onPress={handleRemovePhoto}>
                <Text style={styles.removePhotoButtonText}>Remove Photo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Description */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            {petStatus === "lost" ? "Description (Required)" : "Description (Optional)"}
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Description",
                  petStatus === "lost"
                    ? "Provide details such as breed, color, size, and any distinguishing marks."
                    : "Optionally provide details like breed, color, size, and distinguishing marks."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <TextInput
            style={[styles.boxInput, { height: 80 }]}
            placeholder="Enter description"
            placeholderTextColor="#A9A9AC"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Additional Fields for Found Reports */}
        {petStatus === "found" && (
          <View style={styles.boxContainer}>
            <Text style={styles.boxLabel}>
              Pet Condition (Required)
              <TouchableOpacity
                onPress={() =>
                  showTooltip(
                    "Pet Condition",
                    "Select one: In my custody, Roaming, or Deceased."
                  )
                }
              >
                <Text style={styles.infoIcon}> ⓘ</Text>
              </TouchableOpacity>
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPetCondition("in my custody")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    petCondition === "in my custody" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.radioText}>In my custody</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPetCondition("roaming")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    petCondition === "roaming" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.radioText}>Roaming</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setPetCondition("deceased")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    petCondition === "deceased" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.radioText}>Deceased</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>
            Contact Information (Required)
            <TouchableOpacity
              onPress={() =>
                showTooltip(
                  "Contact Information",
                  petStatus === "lost"
                    ? "Enter your name, phone number, and email as the submitter."
                    : "Enter the finder’s name, phone number, and email."
                )
              }
            >
              <Text style={styles.infoIcon}> ⓘ</Text>
            </TouchableOpacity>
          </Text>
          <TextInput
            style={styles.boxInput}
            placeholder="Name"
            placeholderTextColor="#A9A9AC"
            value={contactName}
            onChangeText={setContactName}
          />
          <TextInput
            style={styles.boxInput}
            placeholder="Phone"
            placeholderTextColor="#A9A9AC"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.boxInput}
            placeholder="Email"
            placeholderTextColor="#A9A9AC"
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#FBF0DC",
  },
  header: {
    height: "25%",
    width: "100%",
    backgroundColor: "#FBF0DC",
    paddingTop: 50,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  headerImage: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  alarmContainer: {
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  alarmImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    color: "#6B431F",
    textAlign: "center",
    fontWeight: "600",
  },
  boxContainer: {
    borderWidth: 1,
    borderColor: "#6B431F",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  boxLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B431F",
    marginBottom: 5,
  },
  infoIcon: {
    color: "#6B431F",
    fontSize: 14,
    marginLeft: 5,
  },
  boxInput: {
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#6B431F",
    borderRadius: 5,
    backgroundColor: "#FBF0DC",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#6B431F",
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 5,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6B431F",
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    backgroundColor: "#6B431F",
  },
  radioText: {
    fontSize: 14,
    color: "#6B431F",
  },
  addPhotoButton: {
    backgroundColor: "#FBF0DC",
    borderWidth: 1,
    borderColor: "#6B431F",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 5,
  },
  addPhotoButtonText: {
    color: "#6B431F",
    fontWeight: "bold",
    fontSize: 14,
  },
  removePhotoButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6B431F",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 5,
  },
  removePhotoButtonText: {
    color: "#6B431F",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#6B431F",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
