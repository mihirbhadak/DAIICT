import { NextRequest, NextResponse } from "next/server"; 
import { promises as fs } from "fs"; 
import { v4 as uuidv4 } from "uuid"; 
import PDFParser from "pdf2json";  
import os from 'os';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("FILE");
  let fileName = "";
  let parsedText = "";

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];

    if (uploadedFile instanceof File) {
      fileName = uuidv4();
      const tempDir = os.tmpdir(); // Get OS-specific temp directory
      const tempFilePath = path.join(tempDir, `${fileName}.pdf`);

      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

      try {
        await fs.writeFile(tempFilePath, fileBuffer); 
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) =>
          console.log(errData.parserError)
        );

        pdfParser.on("pdfParser_dataReady", () => {
          parsedText = (pdfParser as any).getRawTextContent();
        });

        await new Promise((resolve, reject) => {
          pdfParser.loadPDF(tempFilePath);
          pdfParser.on("pdfParser_dataReady", resolve);
          pdfParser.on("pdfParser_dataError", reject);
        });
      } catch (error) {
        console.error('Error writing or processing PDF:', error);
        return new NextResponse("Error processing PDF.", { status: 500 });
      }
    } else {
      console.log('Uploaded file is not in the expected format.');
      return new NextResponse("Uploaded file is not in the expected format.", {
        status: 500,
      });
    }
  } else {
    console.log('No files found.');
    return new NextResponse("No File Found", { status: 404 });
  }

  const response = new NextResponse(parsedText);
  response.headers.set("FileName", fileName);
  return response;
}