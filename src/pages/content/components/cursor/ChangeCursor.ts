import { CaptureCursorState, HandleCaptureEnabled } from "@pages/content/types/Capture";

export const changeCaptureCursor = (handleCursorActive: HandleCaptureEnabled, cursorState: CaptureCursorState) => {
  switch (cursorState) {
    case "default":
      document.body.style.cursor = "default";
      handleCursorActive(false);
      break;

    case "wait":
      document.body.style.cursor = "wait";
      break;

    case "crosshair":
      document.body.style.cursor = "crosshair";
      handleCursorActive(true);
      break;

    default:
      break;
  }
};
