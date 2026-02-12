import axios from "axios";

const API_URL = "http://localhost:5000/api/parse";

console.log("Testing single request to backend...\n");
console.log("Sending test problem...");
console.log('-'.repeat(60));

try {
  const response = await axios.post(
    API_URL,
    {
      problem: "A ball is dropped from 10 meters. How long does it take to hit the ground?",
    },
    {
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
    }
  );

  console.log(`Status: ${response.status}`);
  console.log(`Data:`);
  console.log(JSON.stringify(response.data, null, 2));

  if (response.status !== 200) {
    console.log("\n❌ Error response received");
    console.log(`Message: ${response.data.message || response.data.error}`);
  }
} catch (error) {
  console.log(`❌ Request failed:`);
  console.log(`Error: ${error.message}`);
}
