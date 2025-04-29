interface Pet {
  id: number;
  name: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  photo: any;
  description: string;
  distanceFromUser?: number; // optional for sorting by distance
}

export function sortByName(pets: Pet[]): Pet[] {
  return [...pets].sort((a, b) => a.name.localeCompare(b.name));
}

export function sortByDistance(pets: Pet[]): Pet[] {
  return [...pets].sort((a, b) => {
    if (a.distanceFromUser == null || b.distanceFromUser == null) return 0;
    return a.distanceFromUser - b.distanceFromUser;
  });
}