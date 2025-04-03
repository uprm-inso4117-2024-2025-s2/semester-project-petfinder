import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import PetMarker from '../../components/ui/PetMarker';
import PetDetailsModal from '../../components/ui/PetDetailsModal';
import usePetReports from '../../hooks/usePetReports';

// This component should display a pet's location using coordinates passed as props
const MapScreen = () => {
  // Track the selected pet to display in the modal
  const [selectedPet, setSelectedPet] = useState(null);

  // Fetch or use mock pet reports
  const petReports = usePetReports();

  return (
    <View style={styles.container}>
      {/* Map Display */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.4655,   // Puerto Rico coordinates
          longitude: -66.1057,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Loop through pet reports and render markers */}
        {petReports.map((pet) => (
          <PetMarker
            key={pet.id}
            pet={pet}
            onPress={() => setSelectedPet(pet)}  // Show modal when tapped
          />
        ))}
      </MapView>

      {/* Display Pet Details Modal */}
      <Modal
        visible={!!selectedPet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPet(null)}
      >
        {selectedPet && (
          <PetDetailsModal
            pet={selectedPet}
            onClose={() => setSelectedPet(null)}
          />
        )}
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
