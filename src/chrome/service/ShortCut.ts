import { getCurrentTab } from "@src/chrome/service/Tab";
import { downloadFile } from "@src/chrome/service/Download";

type CaptureMode = "capture_screenshot" | "capture_mode";

export const registerShortCuts = () => {
  console.log("registerShortCut");
  chrome.commands.onCommand.addListener(async (command) => {
    console.log(`Command: ${command}`);

    switch (command) {
      case "capture_screenshot":
        await registerCaptureKey();
        break;

      case "capture_mode":
        await registerCaptureModeKey();
        break;

      default:
        break;
    }
  });
};

const registerCaptureKey = async () => {
  const tab = await getCurrentTab();
  chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (image) => {
    downloadFile({
      type: "download",
      dataUrl: image,
    });
  });
};

export type CursorMode = "capture" | "default";
export type ChangeCursorRequest = {
  type: "change_cursor";
  mode: CursorMode;
};

const registerCaptureModeKey = async () => {
  const tab = await getCurrentTab();

  const req: ChangeCursorRequest = {
    type: "change_cursor",
    mode: "capture",
  };

  await chrome.tabs.sendMessage(tab.id!, req);
};
