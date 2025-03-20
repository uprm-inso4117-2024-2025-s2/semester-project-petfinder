import { Text, View, Platform, Image, TouchableOpacity, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import { SearchBar } from "react-native-screens";
import * as Location from "expo-location";
import { Pet } from "../../components/pet";
import Descriptor from "@/components/descriptor";


const INITIAL_REGION = {
  latitude: 18.209533,
  longitude: -67.140849,
  latitudeDelta: 0.02922,
  longitudeDelta: 0.02421
};



const InitialData: Pet[] = [
  {
    id: 1,
    name: "Henry",
    type: "Dog",
    location: {
      latitude: 18.209533,
      longitude: -67.140849,
    },
    photo: require("../../assets/images/Pet_Finder_Assets/dog.png"),
    description: " Hes a big dog"
  },
  {
    id: 2,
    name: "Jose",
    type: "Dog",
    location: {
      latitude: 18.219533,
      longitude: -67.140849,
    },
    photo: require("../../assets/images/Pet_Finder_Assets/dog.png"),
    description: " Hes a big Dog"
  },
  {
    id: 3,
    name: "Lara",
    type: "Cat",
    location: {
      latitude: 18.219633,
      longitude: -67.141749,
    },
    photo: require("../../assets/images/Pet_Finder_Assets/cat.png"),
    description: " Hes a big cat"
  },
  {
    id: 4,
    name: "Ford",
    type: "Dog",
    location: {
      latitude: 18.209543,
      longitude: -67.140549,
    },
    photo: require("../../assets/images/Pet_Finder_Assets/dog.png"),
    description: " Hes a big dog"
  },
  {
    id: 5,
    name: "Pancho",
    type: "Cat",
    location: {
      latitude: 18.219536,
      longitude: -67.141849,
    },
    photo: require("../../assets/images/Pet_Finder_Assets/cat.png"),
    description: " Hes a big cat"
  },
  {
    id: 6,
    name: "Garfield",
    type: "Cat",
    location: {
      latitude: 18.219533,
      longitude: -67.142849,
    },
    photo: require("../../assets/images/Pet_Finder_Assets/cat.png"),
    description: " Hes a big cat"
  },
]


function filterData(markers:Pet[], param:string, filter:string): Pet[]{

  // This should be done with SQL but its being done with JavaScript for now
  let Data: Pet[] = []
  
  for (let i=0;i<markers.length;i++){
    if (filter === " "){
      if(param === " "){
        return markers
      }
      if(markers[i].name.includes(param)){
        Data.push(markers[i]);
      }
      
    }
    else{
      if(param === ""){
        if(markers[i].type.includes(filter)){
          Data.push(markers[i]);
        }
      }
      if(markers[i].name.includes(param) && markers[i].type.includes(filter)){
        Data.push(markers[i]);
      }


    }

  }
  
  
  
  return Data
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

    setData(filterData(InitialData,searchQuery,selectedFilter));
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
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('Dog')}>
          <Text style={styles.filterButtonText}>Dogs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('Cat')}>
          <Text style={styles.filterButtonText}>Cats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilterPress('Others')}>
          <Text style={styles.filterButtonText}>Others</Text>
        </TouchableOpacity>
      </View>




      <View style={styles.container}>
        <MapView initialRegion={INITIAL_REGION} showsUserLocation={true} showsMyLocationButton style={styles.map}>
          {data.map((pet) => {
            return (
              <Marker
                key={pet.id}
                coordinate={pet.location}
                image={(pet.type === 'Dog') ? require("../../assets/images/Pet_Finder_Assets/Pet_DogMarker.png") : require("../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png")}
              >
                <Callout>
                  <Descriptor id={pet.id} name={pet.name} type={pet.type} location={pet.location} photo= {pet.photo} description={pet.description}></Descriptor>
                </Callout>
              </Marker>
            );
          })}

        </MapView>
      </View>
    </View>
  );
}











