import React from "react";
import { useState } from "react";
import { useWaitForRecognized } from "@pages/content/hooks/useWaitForRecognized";
import { useCursorEnabled } from "@pages/content/hooks/useCursorEnabled";
import { useCaptureEvent } from "@pages/content/hooks/useCaptureEvent";
import { CaptureArea, StartPoint } from "@pages/content/types/Capture";

type Props = {
  recognizedDone: boolean;
  handleRecognizedDone: (done: boolean) => void;
};
export const useCapture = ({ recognizedDone, handleRecognizedDone }: Props) => {
  const [isCaptureEnabled, setIsCaptureEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<StartPoint>({ x: 0, y: 0 });
  const [draggedArea, setDraggedArea] = useState<CaptureArea>({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  });

  const handleCaptureEnabled = (enabled: boolean) => setIsCaptureEnabled(enabled);
  const handleDraggedArea = (area: CaptureArea) => setDraggedArea(area);
  const handleStartPoint = (point: StartPoint) => setStartPoint(point);
  const handleIsDragging = (dragging: boolean) => setIsDragging(dragging);

  useCursorEnabled(isCaptureEnabled, handleCaptureEnabled);

  const { recognizedText } = useCaptureEvent({
    isCaptureEnabled,
    handleCaptureEnabled,
    isDragging,
    handleIsDragging,
    draggedArea,
    handleDraggedArea,
    startPoint,
    handleStartPoint,
    handleRecognizedDone,
  });

  useWaitForRecognized(recognizedDone, handleCaptureEnabled);

  return {
    isDragging,
    draggedArea,
    recognizedText,
  };
};
