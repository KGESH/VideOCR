import { getCurrentTab } from "@src/chrome/service/Tab";
import { downloadFile } from "@src/chrome/service/Download";

export const registerShortCut = () => {
  console.log("registerShortCut");
  chrome.commands.onCommand.addListener(async (command) => {
    console.log(`Command: ${command}`);

    if (command === "capture_screenshot") {
      console.log("capture-screenshot");
      const tab = await getCurrentTab();
      console.log(`background tab: `, tab);

      chrome.tabs.captureVisibleTab(
        tab.windowId,
        { format: "png" },
        (image) => {
          console.log("image", image);

          downloadFile({
            type: "download",
            dataUrl: image,
          });
        }
      );
    }
  });
};
