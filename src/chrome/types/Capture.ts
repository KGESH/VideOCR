export type CaptureType = "capture";

export type CaptureArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CaptureRequest = {
  type: CaptureType;
  area: CaptureArea;
};

export type CaptureResponse = CaptureRequest & {
  imageData: string;
};
