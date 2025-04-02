const request = require("supertest");
const dotenv = require("dotenv");

dotenv.config();

console.log("✅ Supabase URL:", process.env.SUPABASE_URL);
console.log("✅ Supabase Key:", process.env.ANON_KEY);

const API_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.ANON_KEY;
const HEADERS = { "apikey": API_KEY, "Content-Type": "application/json", "Prefer": "return=representation" };

describe("👤 Supabase API - Users Table Tests", () => {
  
  let userId; // Store user ID for update/delete tests

  /** ✅ Test: Create a New User */
  test("POST /users - Should create a new user", async () => {
    console.log("🔍 Testing POST /users request...");

    const newUser = {
      email: "testuser@example.com",
      full_name: "Test User",
      phone: "+1234567890",
      password_hash: "yurrrrrrrrr"
    };

    console.log("🟢 Request Headers:", HEADERS);
    console.log("🟢 Request Body:", newUser);

    const response = await request(API_URL)
      .post("/users")
      .send(newUser)
      .set(HEADERS);

    console.log("🟢 POST Response Status:", response.status);
    console.log("🟢 POST Response Body:", response.body);

    expect(response.status).toBe(201);
    userId = response.body[0]?.id;

    if (!userId) throw new Error("❌ Failed to create user, skipping next tests");
    });


  /** ✅ Test: Fetch All Users */
  test("GET /users - Should fetch all users", async () => {
    if (!userId) return test.skip("Skipping GET test because user creation failed", () => {});

    const response = await request(API_URL)
      .get("/users")
      .set(HEADERS);

    console.log("🟢 GET Response Status:", response.status);
    console.log("🟢 GET Response Body:", response.body);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  /** ✅ Test: Update User's Phone Number */
  test("PATCH /users - Should update user phone number", async () => {
    if (!userId) return test.skip("Skipping PATCH test because user creation failed", () => {});

    const response = await request(API_URL)
      .patch(`/users?id=eq.${userId}`)
      .send({ phone: "+0987654321" }) // ✅ Update phone number
      .set(HEADERS);

    console.log("🟢 PATCH Response Status:", response.status);
    console.log("🟢 PATCH Response Body:", response.body);

    expect(response.status).toBe(200);
  });

  /** ✅ Test: Delete User */
  test("DELETE /users - Should delete the user", async () => {
    if (!userId) {
        console.log("❌ No userId available, skipping DELETE test.");
        return test.skip("Skipping DELETE test because user creation failed", () => {});
    }

    console.log("🔍 DELETE Request URL:", `${API_URL}/users?id=eq.${userId}`);
    console.log("🔍 DELETE Request Headers:", HEADERS);

    const response = await request(API_URL)
      .delete(`/users?id=eq.${userId}`)
      .set(HEADERS);

    console.log("🟢 DELETE Response Status:", response.status);
    console.log("🟢 DELETE Response Body:", response.body);

    expect([200, 204]).toContain(response.status); // ✅ Supabase should return 204 No Content
    });


});
