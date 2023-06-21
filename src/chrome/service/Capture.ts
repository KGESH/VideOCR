import { getCurrentTab } from "@src/chrome/service/Tab";
import {
  TabArea,
  CaptureRequest,
  CaptureResponse,
} from "@src/chrome/types/Capture";
import { DownloadRequest } from "@src/chrome/types/Download";
import { saveImageFile } from "@src/chrome/service/Download";

export const captureScreenShot = () => {
  const area: TabArea = { x: 0, y: 0, width: 100, height: 100 };

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

export const registerDownloadListener = () => {
  chrome.runtime.onMessage.addListener((req: DownloadRequest) => {
    if (req.type === "download") {
      saveImageFile(req.dataUrl);
    }
  });
};

const captureTab = async (req: CaptureRequest): Promise<CaptureResponse> => {
  const tab = await getCurrentTab();
  const image = await new Promise<string>((resolve, reject) => {
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

  return { ...req, imageData: image };
};

export const registerCaptureListener = () => {
  chrome.runtime.onMessage.addListener(
    (req: CaptureRequest, sender, sendResponse) => {
      if (req.type === "capture") {
        captureTab(req).then(sendResponse);
      }

      return true;
    }
  );
};
