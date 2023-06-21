export type CaptureCursorState = "default" | "wait" | "crosshair";

export type CaptureArea = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type StartPoint = {
  x: number;
  y: number;
};

export type HandleCaptureEnabled = (enable: boolean) => void;
export type HandleIsDragging = (isDragging: boolean) => void;
export type HandleDraggedArea = (area: CaptureArea) => void;
export type HandleStartPoint = (startPoint: StartPoint) => void;
