import { createWorker, runOCR } from "@src/ocr/Tesseract";

export const getTextFromImage = async (dataUrl: string) => {
  const worker = await createWorker();
  return await runOCR(worker, dataUrl);
};
