import React from "react";
import { useEffect, useState } from "react";
import { CaptureRequest, CaptureResponse } from "@src/chrome/types/Capture";
import { downloadFile } from "@src/chrome/service/Download";
import { useCopyClipboard } from "@pages/content/hooks/useCopyClipboard";
import { getTextFromImage } from "@src/ocr/Recognize";

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
    const onMouseDown = (e: MouseEvent) => {
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
      if (!isDragging) return;

      setDraggedArea({
        width: Math.abs(e.clientX - startPoint.x),
        height: Math.abs(e.clientY - startPoint.y),
        left: e.clientX < startPoint.x ? e.clientX : startPoint.x,
        top: e.clientY < startPoint.y ? e.clientY : startPoint.y,
      });
    };

    const onMouseUp = (e: MouseEvent) => {
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
        }
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggedArea]);

  return { isDragging, draggedArea };
};
