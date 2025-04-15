import "./config/env.js"; 

// Now import everything else
import express from "express";
import connect from "./db/connection.js";
import morgan from "morgan";
import appRouter from './routes/index.js';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(morgan("dev"));
connect();

app.use("/api/v1", appRouter);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("✅ Server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Server started running on port no. ${PORT}!`);
});