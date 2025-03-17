import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import PDFParser from 'pdf2json';
import path from 'path';
import { File } from 'multer'; // Import Multer's File type directly

// Use the File type from multer directly
export const extractTextFromPDF = async (uploadedFile: File): Promise<string> => {
  if (!uploadedFile || !uploadedFile.mimetype || uploadedFile.mimetype !== 'application/pdf') {
    throw new Error("Invalid file format. Please upload a PDF file.");
  }

  const fileName = uuidv4();
  const tempDir = path.join('/tmp');
  const tempFilePath = path.join(tempDir, `${fileName}.pdf`);

  await fs.mkdir(tempDir, { recursive: true });

  // With multer, the file content is in buffer property
  await fs.writeFile(tempFilePath, uploadedFile.buffer);

  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error("PDF Parsing Error:", errData.parserError);
      reject(errData.parserError);
    });

    pdfParser.on('pdfParser_dataReady', () => {
      fs.unlink(tempFilePath).catch(err => console.error("Error deleting temp file:", err));
      resolve((pdfParser as any).getRawTextContent());
    });

    pdfParser.loadPDF(tempFilePath);
  });
};