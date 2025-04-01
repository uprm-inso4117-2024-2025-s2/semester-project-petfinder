import React from 'react';
import { View, Text, Image, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface PetDetailsModalProps {
  pet: {
    name: string;
    status: string;
    description: string;
    image: string;
    contactInfo: string;
  };
  onClose: () => void; // Function to close the modal
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Pet Image */}
          <Image
            source={{ uri: pet.image || 'https://via.placeholder.com/150' }}
            style={styles.image}
          />

          {/* Pet Name and Status */}
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.status}>
            {pet.status === 'lost' ? 'Lost Pet' : 'Found Pet'}
          </Text>

          {/* Description */}
          <Text style={styles.description}>{pet.description}</Text>

          {/* Contact Information */}
          <Text style={styles.contact}>{pet.contactInfo}</Text>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 💡 Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    fontSize: 18,
    color: '#FF6347', // Red for lost, green for found
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#555',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PetDetailsModal;
