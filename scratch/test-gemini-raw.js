const fs = require("fs");
const path = require("path");

const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const key = match ? match[1].trim() : null;

async function test() {
  if (!key) return;

  console.log("Testing with key:", key);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    console.log("Fetching models list...");
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", JSON.stringify(data.error, null, 2));
    } else {
      console.log("Available models:");
      data.models.forEach(m => console.log("- " + m.name));
    }
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

test();
