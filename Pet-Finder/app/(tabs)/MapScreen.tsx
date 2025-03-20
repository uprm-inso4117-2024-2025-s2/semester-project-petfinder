import { Text, View, Image, TouchableOpacity, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import Descriptor from "@/components/descriptor";

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

const INITIAL_REGION = {
  latitude: 18.209533,
  longitude: -67.140849,
  latitudeDelta: 0.02922,
  longitudeDelta: 0.02421
};

const InitialData: Pet[] = [
  { id: 1, name: "Henry", type: "Dog", location: { latitude: 18.209533, longitude: -67.140849 }, photo: require("../../assets/images/Pet_Finder_Assets/dog.png"), description: "He's a big dog" },
  { id: 2, name: "Jose", type: "Dog", location: { latitude: 18.219533, longitude: -67.140849 }, photo: require("../../assets/images/Pet_Finder_Assets/dog.png"), description: "He's a big Dog" },
  { id: 3, name: "Lara", type: "Cat", location: { latitude: 18.219633, longitude: -67.141749 }, photo: require("../../assets/images/Pet_Finder_Assets/cat.png"), description: "He's a big cat" },
];

function filterData(pets: Pet[], searchQuery: string, selectedFilter: string): Pet[] {
  return pets.filter(pet =>
    (selectedFilter === "" || pet.type.includes(selectedFilter)) &&
    (searchQuery === "" || pet.name.includes(searchQuery))
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF0DC', padding: 10 },
  searchBar: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 10 },
  filterButton: { backgroundColor: '#6B431F', padding: 10, borderRadius: 5, margin: 5 },
  filterButtonText: { color: 'white', fontWeight: 'bold' },
});

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<Pet[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  let locationSubscription: Location.LocationSubscription | null = null;

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

  useEffect(() => {
    setData(filterData(InitialData, searchQuery, selectedFilter));
  }, [selectedFilter, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Pet_Finder_Assets/Pet_Logo.png')} style={{ width: 75, height: 75 }} />
        <TextInput style={styles.searchBar} placeholder="Search..." onChangeText={setSearchQuery} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        {['Dog', 'Cat', 'Others'].map(filter => (
          <TouchableOpacity key={filter} style={styles.filterButton} onPress={() => setSelectedFilter(filter)}>
            <Text style={styles.filterButtonText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <MapView initialRegion={INITIAL_REGION} showsUserLocation style={styles.map}>
        {data.map((pet: Pet) => (
          <Marker key={pet.id} coordinate={pet.location} image={pet.type === 'Dog' ? require("../../assets/images/Pet_Finder_Assets/Pet_DogMarker.png") : require("../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png")}>
            <Callout>
              <Descriptor {...pet} />
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
