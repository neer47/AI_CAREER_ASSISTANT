import { NextFunction, Request, Response } from "express";
import jwt  from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id:string, email:string, expiresIn:string)=>{
    const payLoad = {id, email};
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payLoad, secret, {expiresIn});

    return token;
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
  
    if (!token || token.trim() === '') {
      return res.status(401).json({ message: 'Token Not Received' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
      res.locals.jwtData = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token Expired' });
    }
  };