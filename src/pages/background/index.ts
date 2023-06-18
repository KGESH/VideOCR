import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { registerCaptureListener } from "@src/chrome/service/Capture";
import { registerShortCut } from "@src/chrome/service/ShortCut";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");

chrome.runtime.onConnect.addListener((port) => {
  console.log(port);

  //   port.onMessage.addListener((msg) => {
  //     console.log(`Recv: `, msg);
  //     port.postMessage("Hi Popup.js");
  //   });
  //
  //   port.onDisconnect.addListener(() => {
  //     console.log("Disconnected");
  //   });
  // });
});

registerCaptureListener();

registerShortCut();
