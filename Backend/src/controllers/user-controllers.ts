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

export const userSignup = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        // fetch details from req body
        const { name, email, password } = req.body;
        // Check if user existed or not
        const existingUser = await User.find({email});
        console.log("exosting user details: ", existingUser);
        
        if(existingUser.length > 0){
            return res.status(400).json({
                status: 'false',
                message: 'User already exists'
            });
        }
        // Encrypt the password
        const encryptedPassword = await bcrypt.hash(password, 10);
        // create new user
        const user = new User({name, email, password: encryptedPassword});
        // save user in database
        await user.save();

        // clear  previous cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
          });

        // create token
        const token = createToken(user._id.toString(), user.email, "7d");
        // console.log("token is: ", token);
        
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // add cookie in response
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            expires: expires,
            path:"/",
            domain:"localhost",
            signed:true
        })

        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user
        });
    } catch (error) {
        console.log("Error in signup: ", error);
        return res.status(400).json({
            status: 'false',
            message: error.message
        })
    }
}

export const userLogin = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        // fetch details from req body
        const { email, password } = req.body;

        // Check if user existed or not
        const user = await User.findOne({email});
        console.log("existing user details: ", user);
        if(!user){
            return res.status(400).json({
                status: 'false',
                message: 'User doesnot exists, Signup first!'
            });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                status: 'false',
                message: 'Invalid password'
                });
        }
        
        // clear  previous cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
          });

        // create token
        const token = createToken(user._id.toString(), user.email, "7d");
        // console.log("token is: ", token);
        
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // add cookie in response
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            expires: expires,
            path:"/",
            domain:"localhost",
            signed:true
        })

        return res.status(200).json({
            success:true,
            message:'User login Successfully',
            user
        });
    } catch (error) {
        console.log("Failed to Login: ", error);
        return res.status(400).json({
            status: 'false',
            message: error.message
        })
    }
}

export const userLogout = async (
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
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: "localhost",
        signed: true,
        path: "/",
      });
      return res
        .status(200)
        .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
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