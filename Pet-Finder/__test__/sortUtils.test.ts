// sortUtils.test.ts

import { sortByName, sortByDistance } from "../utils/sortUtils";
import fc from "fast-check";

// Helper: Euclidean distance
function distance(p1: [number, number], p2: [number, number]) {
  return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2);
}

// Arbitrary Pet Generator
const petArb = fc.record({
  id: fc.integer(),
  name: fc.string(),
  type: fc.constantFrom("Dog", "Cat", "Other"),
  location: fc.record({
    latitude: fc.double({ min: -90, max: 90 }),
    longitude: fc.double({ min: -180, max: 180 })
  }),
  photo: fc.constant(null),
  description: fc.string(),
}).map(pet => {
  const user : [number, number]=[18.209533, -67.140849]; // UPRM ref
  const petCoords: [number, number] = [pet.location.latitude, pet.location.longitude];
  return {
    ...pet,
    distanceFromUser: distance(petCoords, user)
  };
});

describe("sortByName", () => {
  it("should sort names in non-decreasing order", () => {
    fc.assert(
      fc.property(fc.array(petArb), pets => {
        const sorted = sortByName(pets);
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i - 1].name.localeCompare(sorted[i].name) > 0) return false;
        }
        return true;
      })
    );
  });

  it("should be idempotent", () => {
    fc.assert(
      fc.property(fc.array(petArb), pets => {
        const once = sortByName(pets);
        const twice = sortByName(once);
        return JSON.stringify(once) === JSON.stringify(twice);
      })
    );
  });
});

describe("sortByDistance", () => {
  it("should sort by ascending distance", () => {
    fc.assert(
      fc.property(fc.array(petArb), pets => {
        const sorted = sortByDistance(pets);
        for (let i = 1; i < sorted.length; i++) {
          if ((sorted[i - 1].distanceFromUser ?? 0) > (sorted[i].distanceFromUser ?? 0)) return false;
        }
        return true;
      })
    );
  });

  it("should be idempotent", () => {
    fc.assert(
      fc.property(fc.array(petArb), pets => {
        const once = sortByDistance(pets);
        const twice = sortByDistance(once);
        return JSON.stringify(once) === JSON.stringify(twice);
      })
    );
  });
});
