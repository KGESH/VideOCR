import Tesseract from "tesseract.js";

export const runOCR = async (worker: Tesseract.Worker, dataUrl: string): Promise<string> => {
  const {
    data: { text: recognizedText },
  } = await worker.recognize(dataUrl);

  return recognizedText;
};

export const createWorker = async (): Promise<Tesseract.Worker> => {
  const worker = await Tesseract.createWorker();
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  return worker;
};

export const setWhitelist = async (worker: Tesseract.Worker) => {
  // await worker.setParameters({
  //   tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  // });
  // await worker.setWhitelist('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
};
