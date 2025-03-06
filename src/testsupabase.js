import supabase from './config/supabaseClient.js';

console.log("🟢 Running Supabase connection test...");

async function testConnection() {
  console.log("🔍 Querying the database...");
  
  const { data, error } = await supabase.from('pets').select('*');

  if (error) {
    console.error('❌ Error fetching data:', error);
  } else {
    console.log('✅ Successfully connected! Data:', data);
  }
}

testConnection();

//to test DB connection to codebase run: node src/testsupabase.js in VScode terminal
