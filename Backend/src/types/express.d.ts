// Add this to your type definitions file (e.g., types/express.d.ts)
import { Express } from 'express';
import multer from 'multer';

declare global {
  namespace Express {
    // Extend the Request interface
    interface Request {
      file?: multer.File;
      files?: {
        [fieldname: string]: multer.File[];
      } | multer.File[];
    }
  }
}