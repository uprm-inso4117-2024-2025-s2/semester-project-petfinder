const { filterData } = require('../filterData');

// Define a sample dataset for testing
const mockPets = [
  { id: 1, name: "Henry", type: "Dog", location: { latitude: 18.209533, longitude: -67.140849 }, photo: "dog.png", description: "He's a big dog" },
  { id: 2, name: "Jose", type: "Dog", location: { latitude: 18.219533, longitude: -67.140849 }, photo: "dog.png", description: "He's a big dog" },
  { id: 3, name: "Lara", type: "Cat", location: { latitude: 18.219633, longitude: -67.141749 }, photo: "cat.png", description: "He's a big cat" },
];

describe("filterData", () => {
  test("returns all pets when no filters are applied", () => {
    const result = filterData(mockPets, "", "");
    expect(result).toEqual(mockPets);
  });

  test("filters pets by type", () => {
    const result = filterData(mockPets, "", "Dog");
    expect(result).toEqual([
      { id: 1, name: "Henry", type: "Dog", location: expect.any(Object), photo: "dog.png", description: "He's a big dog" },
      { id: 2, name: "Jose", type: "Dog", location: expect.any(Object), photo: "dog.png", description: "He's a big dog" },
    ]);
  });

  test("filters pets by search query (name)", () => {
    const result = filterData(mockPets, "Lara", "");
    expect(result).toEqual([
      { id: 3, name: "Lara", type: "Cat", location: expect.any(Object), photo: "cat.png", description: "He's a big cat" }
    ]);
  });

  test("filters pets by type and search query", () => {
    const result = filterData(mockPets, "Henry", "Dog");
    expect(result).toEqual([
      { id: 1, name: "Henry", type: "Dog", location: expect.any(Object), photo: "dog.png", description: "He's a big dog" }
    ]);
  });

  test("returns an empty array when no match is found", () => {
    const result = filterData(mockPets, "NonExistent", "");
    expect(result).toEqual([]);
  });


  test("is case-sensitive by default", () => {
    const result = filterData(mockPets, "henry", "");
    expect(result).toEqual([]); // "henry" (lowercase) does not match "Henry" (capitalized)
  });

  test("returns all pets when selectedFilter is empty but searchQuery is set", () => {
    const result = filterData(mockPets, "Lara", "");
    expect(result).toEqual([
      { id: 3, name: "Lara", type: "Cat", location: expect.any(Object), photo: "cat.png", description: "He's a big cat" }
    ]);
  });
  
  test("return results for partial type matches", () => {
    const result = filterData(mockPets, "", "Do"); // "Do"  matches "Dog" intended
    expect(result).toEqual([{ id: 1, name: "Henry", type: "Dog", location: expect.any(Object), photo: "dog.png", description: "He's a big dog" },
      { id: 2, name: "Jose", type: "Dog", location: expect.any(Object), photo: "dog.png", description: "He's a big dog" }
    ]);
  });

  
 
});
