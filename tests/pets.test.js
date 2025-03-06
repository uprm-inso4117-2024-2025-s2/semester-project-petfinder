// import request from "supertest";
// import dotenv from "dotenv";
const request = require("supertest");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

console.log("✅ Supabase URL:", process.env.SUPABASE_URL);
console.log("✅ Supabase Key:", process.env.ANON_KEY);


const API_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.ANON_KEY;
const HEADERS = { "apikey": API_KEY, "Content-Type": "application/json" };

describe("🐾 Supabase API - Pets Table Tests", () => {
  
  let petId; // Store the pet ID for update/delete tests

  test("POST /pets - Should add a new missing pet", async () => {
    console.log("🔍 Testing POST /pets request...");

    const newPet = {
      name: "Buddy",
      species: "dog",
      last_seen_address: "San Juan",
      status: "missing"
    };

    console.log("🟢 API URL:", API_URL);
    console.log("🟢 Headers:", { "apikey": API_KEY, "Content-Type": "application/json" });

    const response = await request(API_URL)
      .post("/pets")  // ✅ Ensure correct table name
      .send(newPet)
      .set("apikey", API_KEY)
      .set("Content-Type", "application/json")
      .set("Prefer", "return=representation"); // ✅ Ensures Supabase returns inserted data

    console.log("🟢 POST Response Status:", response.status);
    console.log("🟢 POST Response Body:", response.body);

    expect(response.status).toBe(201);
    petId = response.body[0]?.id; 

    if (!petId) throw new Error("❌ Failed to create pet, skipping next tests");
  });



  test("GET /pets - Should fetch all missing pets", async () => {
    if (!petId) return test.skip(); // ✅ Skip GET test if no pet was created

    const response = await request(API_URL)
      .get("/pets?status=eq.Missing")
      .set(HEADERS);

    console.log("🟢 GET Response Status:", response.status);
    console.log("🟢 GET Response Body:", response.body);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("PATCH /pets - Should update pet status to 'Found'", async () => {
    if (!petId) {
        console.log("❌ No petId available, skipping PATCH test.");
        return test.skip("Skipping PATCH test because pet creation failed", () => {});
    }

    console.log("🔍 PATCH Request URL:", `${API_URL}/pets?id=eq.${petId}`);
    console.log("🔍 PATCH Request Headers:", HEADERS);
    console.log("🔍 PATCH Request Body:", { status: "found" });

    const response = await request(API_URL)
      .patch(`/pets?id=eq.${petId}`)
      .send({ status: "found" })
      .set("apikey", API_KEY)
      .set("Content-Type", "application/json")
      .set("Prefer", "return=representation"); // ✅ Ensures Supabase returns updated data

    console.log("🟢 PATCH Response Status:", response.status);
    console.log("🟢 PATCH Response Body:", response.body);

    expect(response.status).toBe(200);
  });


  test("DELETE /pets - Should delete the pet", async () => {
    if (!petId) return test.skip();

    const response = await request(API_URL)
      .delete(`/pets?id=eq.${petId}`)
      .set(HEADERS);

    expect(response.status).toBe(204);
  });

});
