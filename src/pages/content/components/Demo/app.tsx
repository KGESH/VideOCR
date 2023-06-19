import { useEffect } from "react";
import { useCapture } from "@pages/content/hooks/useCapture";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  const { isDragging, draggedArea } = useCapture();

  return (
    <div className="content-view">
      {/** Show dragging area */}
      {isDragging && (
        <div
          style={{
            position: "absolute",
            border: "1px solid black",
            background: "rgba(0, 0, 0, 0.1)",
            ...draggedArea,
          }}
        ></div>
      )}
    </div>
  );
}
