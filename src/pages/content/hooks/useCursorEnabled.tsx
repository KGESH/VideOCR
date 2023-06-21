import { useEffect } from "react";
import { ChangeCursorRequest } from "@src/chrome/service/ShortCut";
import { HandleCaptureEnabled } from "@pages/content/types/Capture";
import { changeCaptureCursor } from "@pages/content/components/cursor/ChangeCursor";

export const useCursorEnabled = (isCaptureEnabled: boolean, handleCaptureEnabled: HandleCaptureEnabled) => {
  useEffect(() => {
    const onMessageReceived = (req: ChangeCursorRequest) => {
      if (req.type === "change_cursor") {
        /** 캡처 커서 비활성화 */
        if (isCaptureEnabled) {
          changeCaptureCursor(handleCaptureEnabled, "default");

          /** 캡처 커서 활성화 */
        } else {
          changeCaptureCursor(handleCaptureEnabled, "crosshair");
        }
      }
    };

    chrome.runtime.onMessage.addListener(onMessageReceived);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessageReceived);
    };
  }, [isCaptureEnabled]);
};
