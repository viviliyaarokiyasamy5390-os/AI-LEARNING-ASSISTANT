// import fs from "fs/promises";
// import pdf from "pdf-parse";

// /**
//  * Extract text from PDF file
//  * @param {string} filePath - Path to PDF file
//  * @returns {Promise<{text: string, numPages: number, info: object}>}
//  */
// export const extractTextFromPDF = async (filePath) => {
//   try {
//     const dataBuffer = await fs.readFile(filePath);

//     const data = await pdf(dataBuffer);

//     console.log("extractedText length:", data.text.length);

//     return {
//       text: data.text,
//       numPages: data.numpages,
//       info: data.info,
//     };
//   } catch (error) {
//     console.error("PDF parsing error:", error);
//     throw new Error("Failed to extract text from PDF");
//   }
// };
// 
import fs from 'fs/promises';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

export const extractTextFromPDF = async (filePath) => {
  try {
    console.log("pdf extraction function called")
    console.log("========== PDF EXTRACTION STARTED ==========");
    console.log("PDF Path:", filePath);

    const data = new Uint8Array(await fs.readFile(filePath));
    console.log("File read success");
    console.log("File Size:", data.length);

    const pdf = await pdfjs.getDocument({ data }).promise;
    console.log("PDF loaded successfully");
    console.log("Total Pages:", pdf.numPages);

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing Page ${i}...`);

      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      console.log(`Page ${i} Items Count:`, content.items.length);

      const pageText = content.items
        .map(item => item.str)
        .join(' ');

      console.log(`Page ${i} Text Length:`, pageText.length);

      fullText += pageText + '\n';
    }

    console.log("========== PDF EXTRACTION COMPLETED ==========");
    console.log("Total Extracted Text Length:", fullText.length);

    if (!fullText.trim()) {
      console.warn("WARNING: No text extracted from PDF");
    }

    return fullText.trim();

  } catch (error) {
    console.error("========== PDF EXTRACTION ERROR ==========");
    console.error(error);

    throw new Error("Failed to extract text from PDF");
  }
};