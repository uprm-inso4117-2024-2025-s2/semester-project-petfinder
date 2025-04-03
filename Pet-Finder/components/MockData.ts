export interface Pet {
  id: number;
  name: string;
  type: string;
  location: { latitude: number; longitude: number };
  photo: any;
  description: string;
}

export const generateMockPets = (count: number): Pet[] => {
  const pets: Pet[] = [];
  const baseLat = 18.209533;
  const baseLng = -67.140849;
  for (let i = 0; i < count; i++) {
    pets.push({
      id: i,
      name: `Pet ${i}`,
      type: i % 2 === 0 ? "Dog" : "Cat",
      location: {
        latitude: baseLat + (Math.random() - 0.5) * 0.05,
        longitude: baseLng + (Math.random() - 0.5) * 0.05,
      },
      photo: null, // Mocked, no require in Node.js
      description: `This is pet #${i}`,
    });
  }
  return pets;
};

export const mockPets = generateMockPets(1000);