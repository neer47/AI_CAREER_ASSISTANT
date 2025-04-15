import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const result = dotenv.config();

  if (result.error) {
    console.error("🔥 Error loading environment variables:", result.error);
    process.exit(1);
  }

  console.log("✅ Environment variables loaded from .env file");
} else {
  console.log("✅ Environment variables loaded from Render (production)");
}

export const envLoaded = true;
