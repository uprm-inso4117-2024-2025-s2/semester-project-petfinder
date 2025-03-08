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

export default function ReportPetScreen() {
  const [petStatus, setPetStatus] = useState<"lost" | "found">("lost");
  const [petName, setPetName] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [dateTime, setDateTime] = useState(""); // display string
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const router = useRouter();

  // Placeholder photo upload logic
  const handlePhotoUpload = () => {
    Alert.alert("Photo Upload", "Placeholder for image picker logic.");
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
    if (!petName || !lastSeenLocation) {
      Alert.alert(
        "Required Fields Missing",
        "Please fill out Pet Name and Last Seen Location."
      );
      return;
    }
    const formData = {
      petStatus,
      petName,
      lastSeenLocation,
      dateTime,
      photoUri,
      description,
      contactInfo,
    };
    console.log("Form Data:", formData);
    Alert.alert("Submitted!", "Your report has been submitted.");
  };

  return (
    <View style={styles.screenContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Top row with back button and logo */}
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
        {/* Alarm image below the top row */}
        <View style={styles.alarmContainer}>
          <Image
            source={require("../../assets/images/Pet_Finder_Assets/alarm.png")}
            style={styles.alarmImage}
          />
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Have you lost your pet?{"\n"}Or found someone else's?
          </Text>
        </View>

        {/* Pet Status */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>Pet status</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPetStatus("lost")}
            >
              <View
                style={[
                  styles.radioCircle,
                  petStatus === "lost" && styles.selectedCircle,
                ]}
              />
              <Text style={styles.radioText}>Lost</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setPetStatus("found")}
            >
              <View
                style={[
                  styles.radioCircle,
                  petStatus === "found" && styles.selectedCircle,
                ]}
              />
              <Text style={styles.radioText}>Found/stray</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet Name */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>Enter the pet name</Text>
          <TextInput
            style={styles.boxInput}
            placeholder="XXXXXX - required"
            placeholderTextColor="#A9A9AC"
            value={petName}
            onChangeText={setPetName}
          />
        </View>

        {/* Last Seen Location */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>Enter the last seen nearest location</Text>
          <TextInput
            style={styles.boxInput}
            placeholder="XXXXXX - required"
            placeholderTextColor="#A9A9AC"
            value={lastSeenLocation}
            onChangeText={setLastSeenLocation}
          />
        </View>

        {/* Date/Time Picker */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>Enter the last seen date and time</Text>
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
          <Text style={styles.boxLabel}>Submit a photo of your pet</Text>
          <TouchableOpacity style={styles.addPhotoButton} onPress={handlePhotoUpload}>
            <Text style={styles.addPhotoButtonText}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>Enter a description of your pet</Text>
          <TextInput
            style={styles.boxInput}
            placeholder="Type your notes - optional"
            placeholderTextColor="#A9A9AC"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Contact Information */}
        <View style={styles.boxContainer}>
          <Text style={styles.boxLabel}>Contact Information</Text>
          <TextInput
            style={styles.boxInput}
            placeholder="Type your notes - optional"
            placeholderTextColor="#A9A9AC"
            value={contactInfo}
            onChangeText={setContactInfo}
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Extra space at bottom (optional) */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

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
  // Scrollable area
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Title
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
  // Box style for each section
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
  boxInput: {
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  // Date Button styles
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
  // Radio Buttons
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
  // Photo Upload
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
  // Submit button
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
