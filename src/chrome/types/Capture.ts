export type CaptureType = "capture";

export type TabArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CaptureRequest = {
  type: CaptureType;
  area: TabArea;
};

export type CaptureResponse = CaptureRequest & {
  imageData: string;
};
