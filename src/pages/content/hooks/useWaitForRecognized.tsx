import { useEffect } from "react";
import { HandleCaptureEnabled } from "@pages/content/types/Capture";
import { changeCaptureCursor } from "@pages/content/components/cursor/ChangeCursor";

export const useWaitForRecognized = (recognizedDone: boolean, handleCaptureEnabled: HandleCaptureEnabled) => {
  useEffect(() => {
    if (recognizedDone) changeCaptureCursor(handleCaptureEnabled, "default");
  }, [recognizedDone]);
};
