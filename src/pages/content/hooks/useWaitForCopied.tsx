import { useEffect } from "react";
import { HandleCaptureEnabled } from "@pages/content/types/Capture";
import { changeCaptureCursor } from "@pages/content/components/cursor/ChangeCursor";

export const useWaitForCopied = (isCopied: boolean, handleCaptureEnabled: HandleCaptureEnabled) => {
  useEffect(() => {
    if (isCopied) changeCaptureCursor(handleCaptureEnabled, "default");
  }, [isCopied]);
};
