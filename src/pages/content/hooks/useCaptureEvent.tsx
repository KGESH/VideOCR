import { HandleCopyClipboard } from "@pages/content/hooks/useCopyClipboard";
import { useEffect, useState } from "react";
import { CaptureRequest, CaptureResponse } from "@src/chrome/types/Capture";
import { getTextFromImage } from "@src/ocr/Recognize";
import {
  CaptureArea,
  HandleCaptureEnabled,
  HandleDraggedArea,
  HandleIsDragging,
  HandleStartPoint,
  StartPoint,
} from "@pages/content/types/Capture";
import { changeCaptureCursor } from "@pages/content/components/cursor/ChangeCursor";

enum MOUSE_BUTTON {
  LEFT,
  MIDDLE,
  RIGHT,
}

type Props = {
  isCaptureEnabled: boolean;
  handleCaptureEnabled: HandleCaptureEnabled;
  isDragging: boolean;
  handleIsDragging: HandleIsDragging;
  draggedArea: CaptureArea;
  handleDraggedArea: HandleDraggedArea;
  startPoint: StartPoint;
  handleStartPoint: HandleStartPoint;
};

export const useCaptureEvent = ({
  isCaptureEnabled,
  handleCaptureEnabled,
  isDragging,
  handleIsDragging,
  draggedArea,
  handleDraggedArea,
  startPoint,
  handleStartPoint,
}: Props) => {
  const [recognizedText, setRecognizedText] = useState<string>();

  useEffect(() => {
    /** 좌클릭 -> 캡처 시작 */
    const onMouseDown = (e: MouseEvent) => {
      if (!isCaptureEnabled || e.button !== MOUSE_BUTTON.LEFT) return;

      handleIsDragging(true);

      handleStartPoint({
        x: e.clientX,
        y: e.clientY,
      });

      handleDraggedArea({
        ...draggedArea,
        left: e.clientX,
        top: e.clientY,
      });
    };

    /** 클릭중 */
    const onMouseMove = (e: MouseEvent) => {
      if (!isCaptureEnabled || !isDragging || e.button !== MOUSE_BUTTON.LEFT) return;

      handleDraggedArea({
        width: Math.abs(e.clientX - startPoint.x),
        height: Math.abs(e.clientY - startPoint.y),
        left: e.clientX < startPoint.x ? e.clientX : startPoint.x,
        top: e.clientY < startPoint.y ? e.clientY : startPoint.y,
      });
    };

    /** 버튼 떼었을 때 -> 캡처 저장 및 텍스트 추출 */
    const onMouseUp = (e: MouseEvent) => {
      if (!isCaptureEnabled || e.button !== MOUSE_BUTTON.LEFT) return;

      handleIsDragging(false);

      const req: CaptureRequest = {
        type: "capture",
        area: {
          x: draggedArea.left * devicePixelRatio,
          y: draggedArea.top * devicePixelRatio,
          width: draggedArea.width * devicePixelRatio,
          height: draggedArea.height * devicePixelRatio,
        },
      };

      chrome.runtime.sendMessage(req, (res: CaptureResponse) => {
        if (res.type === "capture") {
          const capturedTab = res.imageData;
          const image = new Image();
          const area = res.area;

          image.onload = async () => {
            const canvas = document.createElement("canvas");
            canvas.width = area.width / devicePixelRatio;
            canvas.height = area.height / devicePixelRatio;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(
              image,
              area.x,
              area.y,
              area.width,
              area.height,
              0,
              0,
              area.width / devicePixelRatio,
              area.height / devicePixelRatio
            );

            const base64 = canvas.toDataURL("image/png");
            const recognized = await getTextFromImage(base64);
            setRecognizedText(recognized);
            // await copyToClipboard(recognizedText, "text");
            // console.log(recognizedText);
          };

          image.src = capturedTab;

          // reset states
          handleDraggedArea({
            height: 0,
            left: 0,
            top: 0,
            width: 0,
          });

          handleStartPoint({
            x: 0,
            y: 0,
          });

          changeCaptureCursor(handleCaptureEnabled, "wait");
        }
      });
    };

    /** 우클릭 -> 캡처 중단 */
    const onRightClick = (e: MouseEvent) => {
      if (!isCaptureEnabled || e.button !== MOUSE_BUTTON.RIGHT) return;

      e.preventDefault();

      handleIsDragging(false);

      changeCaptureCursor(handleCaptureEnabled, "default");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("contextmenu", onRightClick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("contextmenu", onRightClick);
    };
  }, [draggedArea, isCaptureEnabled]);

  return { recognizedText };
};
