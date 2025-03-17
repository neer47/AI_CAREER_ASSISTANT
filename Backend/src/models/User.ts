import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define Question Schema
const questionSchema = new Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, default: "" },
  expectedAnswer: { type: String, default: "" },
  rating: { type: Number, default: null },
});

// Define Interview Schema
const interviewSchema = new Schema({
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Reference to questions
});

// Define Chat Schema
const chatSchema = new Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
});
  
// Define User Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true }, // Indexed for faster lookup
    password: { type: String, required: true },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }], // Reference to Chat
    interviews: [{ type: Schema.Types.ObjectId, ref: "Interview" }], // Reference to Interview
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create and export models
const Question = model("Question", questionSchema);
const Interview = model("Interview", interviewSchema);
const Chat = model("Chat", chatSchema);
const User = model("User", userSchema);

export { User, Chat, Interview, Question };
