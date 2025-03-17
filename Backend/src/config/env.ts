import dotenv from "dotenv";
const result = dotenv.config();

if (result.error) {
  console.error("🔥 Error loading environment variables:", result.error);
  process.exit(1);
}

console.log("✅ Environment variables loaded");

// Export something so this can be imported as a module
export const envLoaded = true;