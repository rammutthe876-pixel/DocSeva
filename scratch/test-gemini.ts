import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("API Key found:", key ? "Yes (length: " + key.length + ")" : "No");

  if (!key) return;

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Say hello");
    console.log("Response:", result.response.text());
    console.log("Success!");
  } catch (err) {
    console.error("Error during Gemini API call:");
    console.error(err);
  }
}

test();
