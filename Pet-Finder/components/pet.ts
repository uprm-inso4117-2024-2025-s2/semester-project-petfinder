export interface Pet {
    id: number;
    name: string;
    type: string;
    location: {
      latitude: number;
      longitude: number;
    };
    photo: any;
    description: string;
}