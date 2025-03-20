import { Text, View, Image, TouchableOpacity,  Button } from "react-native";
import { Pet } from "./pet";
import { StyleSheet } from "react-native";
import { CalloutSubview } from "react-native-maps";

const styles = StyleSheet.create({
    card: {
      width: 200,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    image: {
      width: "100%",
      height: 100,
      borderRadius: 8,
      marginBottom: 5,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
    },
    description: {
      fontSize: 14,
      color: "gray",
      marginBottom: 5,
    },
    button: {
        marginTop: 10,
        backgroundColor: "red",
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
      },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
  });

export default function Descriptor(Data: Pet){


    const handleReport = (Message: string) =>{

        console.log(Message)
    }
    
    

    return (
        <View style={styles.card}>
          <Image source={Data.photo} style={styles.image} />
          <Text style={styles.name}>{Data.name}</Text>
          <Text style={styles.description}>{Data.description}</Text>
          <CalloutSubview onPress={() => handleReport("Pet reported as found!")}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Report Pet as Found</Text>
            </View>
          </CalloutSubview>
        </View>

    );

}