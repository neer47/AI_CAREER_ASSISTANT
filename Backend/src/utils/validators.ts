import {
  body,
  ValidationChain,
  validationResult,
  checkSchema,
} from "express-validator";
import { NextFunction, Request, Response } from "express";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({ errors: errors.array() });
  };
};

export const interviewValidator = [
  body("interviewId")
    .notEmpty()
    .withMessage("Interview ID is required")
    .isMongoId()
    .withMessage("Invalid Interview ID format"),

  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isMongoId()
    .withMessage("Invalid Question ID format"),

  body("userAnswer")
    .notEmpty()
    .withMessage("User answer is required")
    .isString()
    .withMessage("Answer must be a string"),
];


export const uploadValidator = checkSchema({
  file: {
    custom: {
      options: (value, { req }) => {
        if (!req.files || req.files.length === 0) {
          throw new Error("No file uploaded.");
        }
        const file = req.files[0];
        if (file.mimetype !== "application/pdf") {
          throw new Error("Only PDF files are allowed.");
        }
        return true;
      },
    },
  },
});

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be atleast of 6 character"),
];

export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  ...loginValidator,
];

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message  is required"),
];
