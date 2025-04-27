import { Text, View, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState } from "react";
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


/**
 * Filters the list of pets based on a search query and a selected type filter.
 * @param pets - The list of available pets.
 * @param searchQuery - The search term entered by the user.
 * @param selectedFilter - The type of pet filter selected.
 * @returns The filtered list of pets matching the criteria.
 */

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
  const [dataActual, setData] = useState<Pet[]>([]);
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
    const fetchItems = async () => {
      
      try {
        if(selectedFilter != "" && searchQuery != ""){
          const { data, error: dbError, status } = await supabase
          .from('pets') // Your table name
          .select('id, name, species, latitude, longitude, photo_url, description ') // Specify columns
          .eq('species',selectedFilter.toLowerCase())
          .ilike('name', '%'+searchQuery+'%')
          .order('created_at', {ascending: false})
          .limit(3);

          if (dbError) {
            // Throw the error to be caught by the catch block
            throw dbError;
          }
          console.log(data);
  
          if (data) {
            // Set the fetched data into state
            setData(data);
          }
          return
        }
        
        if(selectedFilter == "" && searchQuery == ""){

          const { data, error: dbError, status } = await supabase
          .from('pets') // Your table name
          .select('id, name, species, latitude, longitude, photo_url, description ') // Specify columns
          .order('created_at', {ascending: false})
          .limit(3);

          if (dbError) {
            // Throw the error to be caught by the catch block
            throw dbError;
          }
          console.log(data);
          console.log("Both are empty")
          if (data) {
            // Set the fetched data into state
            setData(data);
          }
          return

        }

        if(selectedFilter != "" && searchQuery == ""){
          const { data, error: dbError, status } = await supabase
          .from('pets') // Your table name
          .select('id, name, species, latitude, longitude, photo_url, description ') // Specify columns
          .eq('species',selectedFilter.toLowerCase())
          .order('created_at', {ascending: false})
          .limit(3);

          if (dbError) {
            // Throw the error to be caught by the catch block
            throw dbError;
          }
          console.log(data);
  
          if (data) {
            // Set the fetched data into state
            setData(data);
          }
          return
        }

        if(selectedFilter == "" && searchQuery != ""){
          const { data, error: dbError, status } = await supabase
          .from('pets') // Your table name
          .select('id, name, species, latitude, longitude, photo_url, description ') // Specify columns
          .ilike('name', '%'+searchQuery+'%')
          .order('created_at', {ascending: false})
          .limit(3);

          if (dbError) {
            // Throw the error to be caught by the catch block
            throw dbError;
          }
          console.log(data);
  
          if (data) {
            // Set the fetched data into state
            setData(data);
          }
          return
        }

      
        

      } catch (err: any) {
        console.error('Error fetching items:', err);
        
        Alert.alert("Error", `Failed to fetch items: ${err.message || 'Unknown error'}`);
      }
    };
    console.log(searchQuery)
    console.log(selectedFilter)

    fetchItems();
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
    </View>
  );
}
