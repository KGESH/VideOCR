import React from "react";
import { useEffect, useState } from "react";
import { CaptureRequest, CaptureResponse } from "@src/chrome/types/Capture";
import { downloadFile } from "@src/chrome/service/Download";
import { useCopyClipboard } from "@pages/content/hooks/useCopyClipboard";

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
  // const [mouseDownX, setMouseDownX] = useState(0);
  // const [mouseDownY, setMouseDownY] = useState(0);
  // const [draggedWidth, setDraggedWidth] = useState(0);
  // const [draggedHeight, setDraggedHeight] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const { copy, isCopied } = useCopyClipboard();
  const [startPoint, setStartPoint] = useState<StartPoint>({ x: 0, y: 0 });
  const [rectangle, setRectangle] = useState<Rectangle>({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  });

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      console.log("mousedown E", e.clientX, e.clientY);
      setIsDrawing(true);
      // setMouseDownX(e.clientX);
      // setMouseDownY(e.clientY);
      setStartPoint({
        x: e.clientX,
        y: e.clientY,
      });

      setRectangle({
        ...rectangle,
        left: e.clientX,
        top: e.clientY,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;

      // setDraggedWidth(e.clientX - mouseDownX);
      // setDraggedHeight(e.clientY - mouseDownY);
      console.log("mousemove E", e.clientX, e.clientY);
      const debugRectangle: Rectangle = {
        width: Math.abs(e.clientX - startPoint.x),
        height: Math.abs(e.clientY - startPoint.y),
        left: e.clientX < startPoint.x ? e.clientX : startPoint.x,
        top: e.clientY < startPoint.y ? e.clientY : startPoint.y,
      };
      console.log("debugRectangle", debugRectangle);
      setRectangle({
        width: Math.abs(e.clientX - startPoint.x),
        height: Math.abs(e.clientY - startPoint.y),
        left: e.clientX < startPoint.x ? e.clientX : startPoint.x,
        top: e.clientY < startPoint.y ? e.clientY : startPoint.y,
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      // console.log(mouseDownX, mouseDownY, draggedWidth, draggedHeight);
      setIsDrawing(false);

      const req: CaptureRequest = {
        type: "capture",
        area: {
          x: rectangle.left,
          y: rectangle.top,
          width: rectangle.width,
          height: rectangle.height,
        },
      };
      console.log("mouseup E Request2", req);

      chrome.runtime.sendMessage(req, (res: CaptureResponse) => {
        console.log("After Capture res: ", res);
        if (res.type === "capture") {
          const capturedTab = res.imageData;
          const image = new Image();
          const area = res.area;
          console.log(`Received AREA: `, area);

          image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = area.width;
            canvas.height = area.height;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(
              image,
              area.x,
              area.y,
              area.width,
              area.height,
              0,
              0,
              area.width,
              area.height
            );

            const base64 = canvas.toDataURL("image/png");

            downloadFile({
              type: "download",
              dataUrl: base64,
            });

            copy(base64, "image");
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
  }, [rectangle]);

  return { isDrawing, rectangle };
};
