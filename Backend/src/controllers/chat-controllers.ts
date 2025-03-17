import { NextFunction, Request, Response } from "express";
import { User, Chat } from "../models/User.js"; // Import Chat model separately
import { configureOpenAI } from "../config/openai-config.js";

const openai = configureOpenAI();

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// **Generate Chat Completion**
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    const userId = res.locals.jwtData.id;

    // Find user and populate chats
    const user = await User.findById(userId).populate("chats");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Fetch the chat documents based on the IDs in user.chats
    const chatDocuments = await Chat.find({ _id: { $in: user.chats } });

    // Map over the retrieved chat documents
    const chats: ChatMessage[] = chatDocuments.map(({ role, content }) => ({
      role: role as "user" | "assistant",
      content,
    }));

    // Add user's new message to chat history
    const userMessage = new Chat({ role: "user", content: message });
    await userMessage.save();

    user.chats.push(userMessage._id);
    await user.save();

    console.log("Calling OpenAI...");
    try {
      // Get AI response
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [...chats, { content: message, role: "user" }],
      });

      console.log("Chat Response:", chatResponse);
      const aiMessage = chatResponse.choices[0].message;

      // Save AI response to chat history
      const aiChat = new Chat({ role: aiMessage.role, content: aiMessage.content });
      await aiChat.save();

      user.chats.push(aiChat._id);
      await user.save();

      return res.status(200).json({ chats: [...chats, userMessage, aiChat] });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      return res.status(500).json({ message: "OpenAI request failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// **Send Chat History to User**
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.jwtData.id;

    // Find user and populate chats
    const user = await User.findById(userId).populate("chats");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    return res.status(200).json({ message: "OK", chats: user.chats ?? [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// **Delete All Chat History**
export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.jwtData.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Delete all chat documents associated with the user
    await Chat.deleteMany({ _id: { $in: user.chats } });

    // Clear chat references from the user document
    user.chats = [];
    await user.save();

    return res
      .status(200)
      .json({ message: "Chat history deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
