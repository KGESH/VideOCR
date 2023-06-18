import { useEffect, useState } from "react";
import { CaptureRequest, CaptureResponse } from "@src/chrome/types/Capture";

export const useCapture = () => {
  const [mouseDownX, setMouseDownX] = useState(0);
  const [mouseDownY, setMouseDownY] = useState(0);
  const [draggedWidth, setDraggedWidth] = useState(0);
  const [draggedHeight, setDraggedHeight] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      console.log("mousedown E", e.clientX, e.clientY);
      setIsDrawing(true);
      setMouseDownX(e.clientX);
      setMouseDownY(e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      // console.log("mousemove E", e.clientX, e.clientY);
      if (!isDrawing) return;

      setDraggedWidth(e.clientX - mouseDownX);
      setDraggedHeight(e.clientY - mouseDownY);
    };

    const onMouseUp = (e: MouseEvent) => {
      console.log(mouseDownX, mouseDownY, draggedWidth, draggedHeight);
      const req: CaptureRequest = {
        type: "capture",
        area: {
          x: mouseDownX,
          y: mouseDownY,
          width: draggedWidth,
          height: draggedHeight,
        },
      };
      console.log("mouseup E Request2", req);

      chrome.runtime.sendMessage(req, (res: CaptureResponse) => {
        console.log("After Capture res: ", res);
        if (res.type === "capture") {
          const capturedTab = res.imageData;
          const image = new Image();
          const area = res.area;

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
            console.log("base64: ", base64);
          };

          image.src = capturedTab;
        }
      });

      setIsDrawing(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [mouseDownX, mouseDownY, draggedWidth, draggedHeight]);
};
