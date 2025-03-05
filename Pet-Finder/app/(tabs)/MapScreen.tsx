import { Text, View, Platform, Image, TouchableOpacity, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import MapView, {Marker} from 'react-native-maps';
import React, { useState } from "react";
import { SearchBar } from "react-native-screens";

const INITIAL_REGION = {
	latitude: 18.209533, 
	longitude: -67.140849,
	latitudeDelta: 0.02922,
	longitudeDelta: 0.02421
};



export default function Map() {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    // Placeholder functionality: Log the selected filter
    console.log(`Selected filter: ${filter}`);
    };



  return (
    <View style={{ flex: 1, marginBottom: '20%' }}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Pet_Finder_Assets/Pet_Logo.png')} style={styles.headerImage} />
        <TextInput
          style={styles.searchBar}
          placeholder=" Search..."
          placeholderTextColor="#A9A9AC"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
            <Marker
            coordinate={{ latitude: 18.209533, longitude: -67.140849 }}
            title={"Marker Title"}
            description={"Marker Description"}
            image={require('../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png')}
            />
            <Marker
            coordinate={{ latitude: 18.219533, longitude: -67.140849 }}
            title={"Marker Title"}
            description={"Marker Description"}
            image={require('../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png')}
            />
            <Marker
            coordinate={{ latitude: 18.219533, longitude: -67.141849 }}
            title={"Marker Title"}
            description={"Marker Description"}
            image={require('../../assets/images/Pet_Finder_Assets/Pet_CatMarker.png')}
            />
        </MapView>
      </View>
    </View>
  );
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