import React from "react";
import { useEffect, useState } from "react";
import { CaptureRequest, CaptureResponse } from "@src/chrome/types/Capture";
import { useCopyClipboard } from "@pages/content/hooks/useCopyClipboard";
import { getTextFromImage } from "@src/ocr/Recognize";
import { ChangeCursorRequest } from "@src/chrome/service/ShortCut";

type Rectangle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type StartPoint = {
  x: number;
  y: number;
};

export const useCapture = () => {
  const [isCaptureCursorActive, setIsCaptureCursorActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { copyToClipboard, isCopied } = useCopyClipboard();
  const [startPoint, setStartPoint] = useState<StartPoint>({ x: 0, y: 0 });
  const [draggedArea, setDraggedArea] = useState<Rectangle>({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  });

  useEffect(() => {
    const onMessageReceived = (req: ChangeCursorRequest) => {
      if (req.type === "change_cursor") {
        /** 캡처 커서 비활성화 */
        if (isCaptureCursorActive) {
          disableCaptureCursor(setIsCaptureCursorActive);

          /** 캡처 커서 활성화 */
        } else {
          enableCaptureCursor(setIsCaptureCursorActive);
        }
      }
    };

    chrome.runtime.onMessage.addListener(onMessageReceived);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessageReceived);
    };
  }, [isCaptureCursorActive]);

  useEffect(() => {
    const onRightClick = (e: MouseEvent) => {
      if (!isCaptureCursorActive) return;

      e.preventDefault();

      setIsDragging(false);

      disableCaptureCursor(setIsCaptureCursorActive);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!isCaptureCursorActive) return;

      setIsDragging(true);

      setStartPoint({
        x: e.clientX,
        y: e.clientY,
      });

      setDraggedArea({
        ...draggedArea,
        left: e.clientX,
        top: e.clientY,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isCaptureCursorActive || !isDragging) return;

      setDraggedArea({
        width: Math.abs(e.clientX - startPoint.x),
        height: Math.abs(e.clientY - startPoint.y),
        left: e.clientX < startPoint.x ? e.clientX : startPoint.x,
        top: e.clientY < startPoint.y ? e.clientY : startPoint.y,
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isCaptureCursorActive) return;

      setIsDragging(false);

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
            const recognizedText = await getTextFromImage(base64);
            await copyToClipboard(recognizedText, "text");
            console.log(recognizedText);
          };

          image.src = capturedTab;

          disableCaptureCursor(setIsCaptureCursorActive);

          // reset states
          setDraggedArea({
            height: 0,
            left: 0,
            top: 0,
            width: 0,
          });

          setStartPoint({
            x: 0,
            y: 0,
          });
        }
      });
    };

    document.addEventListener("contextmenu", onRightClick);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("contextmenu", onRightClick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggedArea, isCaptureCursorActive]);

  return { isDragging, draggedArea, isCaptureCursorActive };
};

const disableCaptureCursor = (
  setIsCaptureCursorActive: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void
) => {
  setIsCaptureCursorActive(false);
  document.body.style.cursor = "default";
};

const enableCaptureCursor = (
  setIsCaptureCursorActive: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void
) => {
  setIsCaptureCursorActive(true);
  document.body.style.cursor = "wait";
};
