import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { MapIcons } from '../../constants/MapIcons';
import { Colors } from '../../constants/Colors';

interface PetMarkerProps {
  pet: {
    id: number;
    name: string;
    status: string;
    latitude: number;
    longitude: number;
  };
  onPress: () => void; // Function to open the modal
}

const PetMarker: React.FC<PetMarkerProps> = ({ pet, onPress }) => {
  // Choose icon and color based on pet status
  const icon = pet.status === 'lost' ? MapIcons.lostIcon : MapIcons.foundIcon;
  const tintColor = pet.status === 'lost' ? Colors.red : Colors.green;

  return (
    <Marker
      coordinate={{ latitude: pet.latitude, longitude: pet.longitude }}
      title={pet.name}
      description={pet.status === 'lost' ? 'Lost Pet' : 'Found Pet'}
      onPress={onPress} // Open modal when tapped
    >
      {/* Display icon as marker */}
      <Image source={icon} style={{ width: 40, height: 40, tintColor }} />
    </Marker>
  );
};

export default PetMarker;
