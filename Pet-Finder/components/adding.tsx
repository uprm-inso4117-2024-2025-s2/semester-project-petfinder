interface PetInsertData {
    id?: number; // Optional: Only include if you manually manage IDs
    name: string;
    species: string;
    latitude: number;
    longitude: number;
    photo_url: string | null; // Storing a URL string or null
    description: string;
    status: string;
}
interface Pet {
    id: number;
    name: string;
    species: string;
    
    latitude: number;
    longitude: number;
    
    photo_url: any;
    description: string;
}

const InitialData: Pet[] = [
    { id: 1, name: "Henry", species: "dog", latitude: 18.209533, longitude: -67.140849, photo_url: require("../../assets/images/Pet_Finder_Assets/dog.png"), description: "He's a big dog" },
    { id: 2, name: "Jose", species: "dog", latitude: 18.219533, longitude: -67.140849 , photo_url: require("../../assets/images/Pet_Finder_Assets/dog.png"), description: "He's a big Dog" },
    { id: 3, name: "Lara", species: "cat", latitude: 18.219633, longitude: -67.141749 , photo_url: require("../../assets/images/Pet_Finder_Assets/cat.png"), description: "He's a big cat" },
  ];



const dataToInsert: PetInsertData[] = InitialData.map(pet => {
        // ** IMPORTANT: Handle photo_url **
        // Replace this with null, a placeholder, or the actual Supabase Storage URL
        // once you implement image uploads. Storing the 'require()' result won't work.
    
        let actualPhotoUrl = null; 
        if (pet.species == "dog"){
          actualPhotoUrl = "../../assets/images/Pet_Finder_Assets/dog.png";
        }
        else{
          actualPhotoUrl = "../../assets/images/Pet_Finder_Assets/cat.png";
        }
    
         // Placeholder for demonstration
    
        return {
          // Omit 'id' if your database generates it automatically
          // id: pet.id, // Include this line ONLY if you manually manage IDs
          name: pet.name,
          species: pet.species,
          latitude: pet.latitude,
          longitude: pet.longitude,
          photo_url: actualPhotoUrl,
          description: pet.description,
          status: "missing",
        };
      });

      console.log("Below is Data List")
      console.log(dataToInsert)