import { Text, View, Platform, Image, TouchableOpacity, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import { SearchBar } from "react-native-screens";
import * as Location from "expo-location";



const INITIAL_REGION = {
  latitude: 18.209533,
  longitude: -67.140849,
  latitudeDelta: 0.02922,
  longitudeDelta: 0.02421
};

interface Pet {
  id: number;
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
}


const styles = StyleSheet.create({
  header: {

    height: '10%',
    width: '100%',
    backgroundColor: '#FBF0DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 0,
    flexDirection: 'row',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FBF0DC',
  },
  filterButton: {
    backgroundColor: '#6B431F',
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  headerImage: {
    width: 75,
    height: 75,
    marginRight: 60,
    marginLeft: 15
  },
  searchBar: {
    fontSize: 18,

    fontWeight: 'bold',
    marginRight: 15,
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    marginBottom: 10

  },
});

export default function Map() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([] as Pet[]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 5 seconds
          distanceInterval: 10, // Update when moving 10 meters
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);
  useEffect(() => {
    console.log(`Selected UseEffect: ${searchQuery}`);
    setData([
      {
        id: 1,
        name: "Dog 1",
        type: "Dog",
        location: {
          latitude: 18.209533,
          longitude: -67.140849,
        },
      },
      {
        id: 2,
        name: "Dog 2",
        type: "Dog",
        location: {
          latitude: 18.219533,
          longitude: -67.140849,
        },
      },
      {
        id: 3,
        name: "Dog 3",
        type: "Cat",
        location: {
          latitude: 18.219533,
          longitude: -67.141849,
        },
      },
    ]);
  }, [selectedFilter, searchQuery]);
  const handleFilterPress = (filter: string) => {

    setSelectedFilter(filter);
    console.log(`Selected Button: ${filter}`);
  };
  return (
    <View style={{ flex: 1, marginBottom: '20%' }}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Pet_Finder_Assets/Pet_Logo.png')} style={styles.headerImage} />
        <TextInput
          style={styles.searchBar}
          placeholder=" Search..."
          placeholderTextColor="#A9A9AC"
          onEndEditing={(text) => setSearchQuery(text.nativeEvent.text)}
        />
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('Dogs')}>
          <Text style={styles.filterButtonText}>Dogs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('Cats')}>
          <Text style={styles.filterButtonText}>Cats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('Others')}>
          <Text style={styles.filterButtonText}>Others</Text>
        </TouchableOpacity>
      </View>




      <View style={styles.container}>
        <MapView initialRegion={INITIAL_REGION} showsUserLocation={true} style={styles.map}>
          {data.map((pet) => {
            return (
              <Marker
                key={pet.id}
                coordinate={pet.location}
                title={pet.name}
                description={pet.type}
                image={(pet.type === 'Dog') ? require("../../assets/images/Pet_Finder_Assets/Pet_DogMarker.png") : require("../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png")}
              />
            );
          })}

        </MapView>
      </View>
    </View>
  );
}











