import { getCurrentTab } from "@src/chrome/service/Tab";
import {
  CaptureArea,
  CaptureRequest,
  CaptureResponse,
} from "@src/chrome/types/Capture";

export const captureScreenShot = () => {
  const area: CaptureArea = { x: 0, y: 0, width: 100, height: 100 };

  console.log(`Call captureScreenShot`);
  chrome.runtime.sendMessage(
    {
      message: "capture",
      area,
    },
    (res) => {
      console.log("Capture response res: ", res);
      saveImageFile(res);
    }
  );
};

export const saveImageFile = (dataUrl: string) => {
  chrome.downloads.download(
    {
      filename: "image.png",
      url: dataUrl,
    },
    (downloadId) => {
      console.log("downloadId", downloadId);
    }
  );
};

export const registerCaptureListener = () => {
  console.log("registerCaptureListener");

  chrome.runtime.onMessage.addListener(
    async (req: CaptureRequest, sender, sendResponse) => {
      console.log("captureMedia onMessage3: ", req);

      if (req.type === "capture") {
        const tab = await getCurrentTab();

        const img = await new Promise<string>((resolve, reject) => {
          chrome.tabs.captureVisibleTab(
            tab.windowId,
            { format: "png" },
            (capturedTab) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
              } else {
                resolve(capturedTab);
              }
            }
          );
        });

        const res: CaptureResponse = {
          ...req,
          imageData: img,
        };

        console.log("==============captureMedia img2==============: ", res);
        sendResponse(res);
        return true;
      } else {
        console.log("ELSE", req);
      }

      console.log("Failed to capture LOG");

      sendResponse("Failed to capture");
      return true;
    }
  );
};
