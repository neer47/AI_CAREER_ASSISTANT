import { NextFunction, Request, Response } from "express"
import {User} from "../models/User.js"
import bcrypt from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import {COOKIE_NAME} from "../utils/constants.js"

export const getAllUsers = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        // get all users
        const users = User.find().exec();
        return res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.log("Error in fetching all users: ", error.message);
        return res.status(500).json({
            status: 'false',
            message: error.message
        })
    }
}

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch details from req body
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.find({ email });
    console.log("Existing user details:", existingUser);

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: "false",
        message: "User already exists",
      });
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({ name, email, password: encryptedPassword });
    await user.save();

    // Clear previous cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      path: "/", // Remove domain to default to current host
      signed: true,
    });

    // Create token
    const token = createToken(user._id.toString(), user.email, "7d");
    console.log("Generated token:", token);

    // Set cookie with production-friendly options
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      expires: expires,
      path: "/",
      secure: process.env.NODE_ENV === "production", // Only secure in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin in production
      signed: true,
    });

    // Return response
    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user: { email: user.email, name: user.name }, // Match frontend expectation
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch details from req body
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("Existing user details:", user);
    if (!user) {
      return res.status(400).json({
        status: "false",
        message: "User does not exist, Signup first!",
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "false",
        message: "Invalid password",
      });
    }

    // Clear previous cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      path: "/", // Remove domain to default to current host
      signed: true,
    });

    // Create token
    const token = createToken(user._id.toString(), user.email, "7d");
    console.log("Generated token:", token);

    // Set cookie with production-friendly options
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      expires: expires,
      path: "/",
      secure: process.env.NODE_ENV === "production", // Only secure in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin in production
      signed: true,
    });

    // Return response
    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user: { email: user.email, name: user.name }, // Match frontend expectation
    });
  } catch (error) {
    console.log("Failed to login:", error);
    return res.status(400).json({
      status: "false",
      message: error.message,
    });
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    // Clear the cookie with production-friendly options
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      path: "/", // Remove domain to default to current host
      signed: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-origin in production
    });

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({ // Changed to 500 for server error
      message: "ERROR",
      cause: error.message,
    });
  }
};

export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
      return res
        .status(200)
        .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };