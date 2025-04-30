import { Text, View, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import Descriptor from "@/components/descriptor";
import { sortByDistance, sortByName } from "@/utils/sortUtils";
import { supabase } from '../../utils/supabase';


/**
 * Interface representing a pet object.
 */
interface Pet {
  id: number;
  name: string;
  species: string;
  
  latitude: number;
  longitude: number;
  
  photo_url: any;
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

let startData = [] as Pet[]
const fetchItems = async () => {
  console.log("Fetching Initial");
  try {
    let query = supabase
      .from('pets')
      .select('id, name, species, latitude, longitude, photo_url, description')
      .order('created_at', { ascending: false })
      .limit(3); // Maybe increase limit? 3 seems very low.

    // Apply filters conditionally
    

    const { data, error: dbError } = await query;

    if (dbError) {
      throw dbError;
    }

    // console.log("Fetched Data:", data);
    startData = data;

    return 
     // Set data or empty array if data is null/undefined

  } catch (err: any) {
    console.error('Error fetching items:', err);
    Alert.alert("Error", `Failed to fetch items: ${err.message || 'Unknown error'}`);
  }
};

fetchItems();


/**
 * Styles for various UI components.
 */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF0DC', marginTop: 50, padding: 10},
  searchBar: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10},
  filterButton: { backgroundColor: '#6B431F', padding: 10, borderRadius: 5, margin: 5 },
  clearButton: {backgroundColor: 'red', padding: 10, borderRadius: 5, margin: 5 },
  filterButtonText: { color: 'white', fontWeight: 'bold' },
  userLocationButton: {
    position: "absolute",
    bottom: "12%",
    right: "5%",
    backgroundColor: "#FBF0DC",
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  }
});

/**
 * Main component for the pet finder map screen.
 * Displays a map with pet markers, a search bar, and filtering options.
 */
export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataActual, setData] = useState<Pet[]>(startData);
  const [userLocation, setUserLocation] = useState< Location.LocationObject  | null>(null);
  const mapRef = useRef<MapView>(null)
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
        (location) => setUserLocation(location)
      );
    };

    startTracking();
    return () => { locationSubscription?.remove(); };
  }, []);

  /**
   * Effect hook to filter pets based on search query and selected filter.
   */
  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching with filter:", selectedFilter, "?? query:", searchQuery);
      try {
        let query = supabase
          .from('pets')
          .select('id, name, species, latitude, longitude, photo_url, description')
          .order('created_at', { ascending: false })
          .limit(3); // Maybe increase limit? 3 seems very low.
  
        // Apply filters conditionally
        if (selectedFilter) { // Check if filter is not empty string
          query = query.eq('species', selectedFilter.toLowerCase());
        }
        if (searchQuery) { // Check if query is not empty string
          query = query.ilike('name', `%${searchQuery}%`);
        }
  
        const { data, error: dbError } = await query;
  
        if (dbError) {
          throw dbError;
        }
  
        // console.log("Fetched Data:", data);
        setData(data);
         // Set data or empty array if data is null/undefined
  
      } catch (err: any) {
        console.error('Error fetching items:', err);
        setData([]); // Clear data on error
        Alert.alert("Error", `Failed to fetch items: ${err.message || 'Unknown error'}`);
      }
    };
  
    fetchItems();
  }, [selectedFilter, searchQuery]); // Dependencies are correct

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status != 'granted') {
        return;
      }
      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5,
      });
      setUserLocation(userLocation);
    }) ();
  }, []);

  const goToCurrentLocation = async () => {
    if(userLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        altitude: 2000,
        zoom: 15,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Logo and Search Bar */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/Pet_Finder_Assets/Pet_Logo.png')} style={{ width: 75, height: 75 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor = "#919397"
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons for Pet Type */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 ,backgroundColor: '#FBF0DC'}}>
        {['Dog', 'Cat', 'Others','Clear'].map(filter => (
          <TouchableOpacity key={filter} style={filter === "Clear" ? styles.clearButton: styles.filterButton} onPress={() => filter === "Clear" ? setSelectedFilter("") : setSelectedFilter(filter)}>
            <Text style={styles.filterButtonText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map View with Pet Markers */}
      <MapView ref={mapRef} initialRegion={INITIAL_REGION} showsUserLocation={true} style={styles.map}>
        {dataActual.map((pet: Pet) => (
          <Marker
            key={pet.id}

            coordinate={{latitude : pet.latitude ,  longitude: pet.longitude}}
            image={pet.species === 'dog' ? require("../../assets/images/Pet_Finder_Assets/Pet_DogMarker.png") : require("../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png")}

          >
            <Callout>
              <Descriptor {...pet} />
            </Callout>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity testID="userLocationButton" style={styles.userLocationButton} onPress={goToCurrentLocation}>
        <Image 
        source={require("../../assets/images/Pet_Finder_Assets/Pet_UserLocation.png")}
        style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
  );
}
