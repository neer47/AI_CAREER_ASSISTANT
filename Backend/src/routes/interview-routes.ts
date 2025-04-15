import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { validate, interviewValidator } from "../utils/validators.js";
import { startInterview, submitAnswer, getInterviews, deleteInterview } from "../controllers/interview-controllers.js";
import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });
const interviewRoutes = Router();

// Start a new interview (generate questions using OpenAI)
interviewRoutes.post("/start", verifyToken, (req, res, next) => {
    console.log("Request body:", req.body);  // Should be empty or minimal
    console.log("Request file:", req.file);  // Should be undefined here
    next();
  }, upload.single("pdfFile"), (req, res, next) => {
    console.log("After multer - Request file:", req.file);  // Should show file details
    next();
  }, startInterview);

// Submit an answer (evaluate, rate, and generate expected answer)
interviewRoutes.post("/submit", validate(interviewValidator), verifyToken, submitAnswer);

// Get all interview sessions for a user
interviewRoutes.get("/all", verifyToken, getInterviews);

// Delete an interview session
interviewRoutes.delete("/delete/:interviewId", verifyToken, deleteInterview);

export default interviewRoutes;
