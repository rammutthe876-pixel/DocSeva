const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const key = match ? match[1].trim() : null;

async function test() {
  if (!key) return;

  const genAI = new GoogleGenerativeAI(key);
  
  // Try forcing v1 and try different model names
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

  for (const modelName of modelsToTry) {
    console.log(`Trying ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`Success with ${modelName}:`, result.response.text());
      break;
    } catch (err) {
      console.error(`Error with ${modelName}:`, err.message);
    }
  }
}

test();
