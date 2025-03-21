import { Text, View, Image, TouchableOpacity, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import Descriptor from "@/components/descriptor";

/**
 * Interface representing a pet object.
 */
interface Pet {
  id: number;
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  photo: any;
  description: string;
}

/**
 * Default initial region for the map view.
 */
const INITIAL_REGION = {
  latitude: 18.209533,
  longitude: -67.140849,
  latitudeDelta: 0.02922,
  longitudeDelta: 0.02421
};

/**
 * Initial dataset of pets available for display.
 */
const InitialData: Pet[] = [
  { id: 1, name: "Henry", type: "Dog", location: { latitude: 18.209533, longitude: -67.140849 }, photo: require("../../assets/images/Pet_Finder_Assets/dog.png"), description: "He's a big dog" },
  { id: 2, name: "Jose", type: "Dog", location: { latitude: 18.219533, longitude: -67.140849 }, photo: require("../../assets/images/Pet_Finder_Assets/dog.png"), description: "He's a big Dog" },
  { id: 3, name: "Lara", type: "Cat", location: { latitude: 18.219633, longitude: -67.141749 }, photo: require("../../assets/images/Pet_Finder_Assets/cat.png"), description: "He's a big cat" },
];

/**
 * Filters the list of pets based on a search query and a selected type filter.
 * @param pets - The list of available pets.
 * @param searchQuery - The search term entered by the user.
 * @param selectedFilter - The type of pet filter selected.
 * @returns The filtered list of pets matching the criteria.
 */
function filterData(pets: Pet[], searchQuery: string, selectedFilter: string): Pet[] {
  return pets.filter(pet =>
    (selectedFilter === "" || pet.type.includes(selectedFilter)) &&
    (searchQuery === "" || pet.name.includes(searchQuery))
  );
}

/**
 * Styles for various UI components.
 */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF0DC', padding: 10 },
  searchBar: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10 },
  filterButton: { backgroundColor: '#6B431F', padding: 10, borderRadius: 5, margin: 5 },
  filterButtonText: { color: 'white', fontWeight: 'bold' },
});

/**
 * Main component for the pet finder map screen.
 * Displays a map with pet markers, a search bar, and filtering options.
 */
export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<Pet[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  let locationSubscription: Location.LocationSubscription | null = null;

  /**
   * Effect hook to request location permissions and start tracking user location.
   */
  useEffect(() => {
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
        (location) => setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude })
      );
    };

    startTracking();
    return () => { locationSubscription?.remove(); };
  }, []);

  /**
   * Effect hook to filter pets based on search query and selected filter.
   */
  useEffect(() => {
    setData(filterData(InitialData, searchQuery, selectedFilter));
  }, [selectedFilter, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header with Logo and Search Bar */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/Pet_Finder_Assets/Pet_Logo.png')} style={{ width: 75, height: 75 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons for Pet Type */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        {['Dog', 'Cat', 'Others'].map(filter => (
          <TouchableOpacity key={filter} style={styles.filterButton} onPress={() => setSelectedFilter(filter)}>
            <Text style={styles.filterButtonText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map View with Pet Markers */}
      <MapView initialRegion={INITIAL_REGION} showsUserLocation style={styles.map}>
        {data.map((pet: Pet) => (
          <Marker
            key={pet.id}
            coordinate={pet.location}
            image={pet.type === 'Dog' ? require("../../assets/images/Pet_Finder_Assets/Pet_DogMarker.png") : require("../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png")}
          >
            <Callout>
              <Descriptor {...pet} />
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
