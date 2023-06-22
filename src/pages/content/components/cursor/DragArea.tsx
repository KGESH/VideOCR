import { CaptureArea } from "@pages/content/types/Capture";

export const DragArea = (draggedArea: CaptureArea) => {
  return (
    <div
      style={{
        position: "fixed",
        border: "1px solid black",
        background: "rgba(0, 0, 0, 0.1)",
        ...draggedArea,
      }}
    ></div>
  );
};
