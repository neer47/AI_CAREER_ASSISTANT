import { Request, Response } from "express";
import { User, Interview, Question } from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import mongoose from "mongoose";

const openai = configureOpenAI();

// **Start an interview**
export const startInterview = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found or unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract text from the uploaded PDF
    const extractedText = await extractTextFromPDF(req.file);
    console.log("Extracted Text:", extractedText);

    // Generate interview questions using OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate 5 interview questions based on the given text.",
        },
        { role: "user", content: extractedText },
      ],
    });

    console.log(
      "Generated Questions:",
      chatResponse.choices[0].message.content
    );

    const questionsArray = chatResponse.choices[0].message.content
      .split("\n")
      .filter((q) => q.trim()) // Remove empty lines
      .map((q) => q.replace(/^\d+\.\s*/, "")); // Remove numbering

    // ✅ Step 1: Save Questions in the `Question` Collection First
    const createdQuestions = await Question.insertMany(
      questionsArray.map((q) => ({
        question: q,
        userAnswer: "",
        expectedAnswer: "",
        rating: null,
      }))
    );

    // ✅ Step 2: Store Only the `_id` References in `Interview`
    const newInterview = new Interview({
      userId: user._id,
      questions: createdQuestions.map((q) => q._id), // Store only ObjectId references
    });

    await newInterview.save();

    // ✅ Step 3: Save Interview Reference in User Profile
    user.interviews.push(newInterview._id);
    await user.save();

    return res
      .status(200)
      .json({ interviewId: newInterview._id, questions: createdQuestions });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// **Submit an answer (evaluate, rate, and generate expected answer)**
export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const { interviewId, questionId, userAnswer } = req.body;

    if (!interviewId || !questionId) {
      return res
        .status(400)
        .json({ message: "Missing interviewId or questionId" });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Find the question in the database
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Call OpenAI to generate an expected answer and rate the response
    const prompt = `Question: ${question}
                    User's Answer: ${userAnswer}

                    Evaluate the user's answer and provide:
                    1. An expected answer in the format: "Expected Answer: <answer>"
                    2. A rating (1-10) in the format: "Rating: <number>".

                    Ensure the response follows this exact structure.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI interviewer evaluating answers.",
        },
        { role: "user", content: prompt },
      ],
    });

    // Extract expected answer and rating from the OpenAI response
    const aiResponse = response.choices[0].message.content.split("\n");
    console.log(response.choices[0].message.content);
    const expectedAnswer =
      aiResponse[0]?.replace("Expected Answer:", "").trim() ||
      "No expected answer provided.";
    const rating = parseInt(aiResponse[1]?.replace("Rating:", "").trim()) || 0;
    console.log("the expected Answer:", expectedAnswer);
    console.log("the rating:", rating);
    // Update the question in the database
    await Question.findByIdAndUpdate(questionId, {
      userAnswer,
      expectedAnswer,
      rating,
    });

    return res.json({
      message: "Answer submitted successfully",
      updatedQuestion: { userAnswer, expectedAnswer, rating },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// **Get all interviews for a user**import mongoose from "mongoose";

export const getInterviews = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.id;
    console.log("The userId is: ", userId);
    console.log("The type of userId is: ", typeof userId);

    // Convert userId to ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Fetch the user, populate interviews, then populate questions within interviews
    const user = await User.findById(objectIdUserId)
      .populate({
        path: "interviews",
        populate: { path: "questions" }, // Populate questions inside interviews
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("The interviews are: ", JSON.stringify(user.interviews, null, 2));
    return res.status(200).json(user.interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};


// **Delete an interview session**
export const deleteInterview = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.id;
    const { interviewId } = req.params;

    // Find the interview to get the associated questions
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Remove the interview reference from the user document
    await User.findByIdAndUpdate(userId, {
      $pull: { interviews: interviewId },
    });

    // Delete all questions linked to the interview
    await Question.deleteMany({ _id: { $in: interview.questions } });

    // Delete the interview document itself
    await Interview.findByIdAndDelete(interviewId);

    return res.status(200).json({ message: "Interview and associated questions deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

