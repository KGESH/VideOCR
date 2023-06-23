import React from "react";
import { useCapture } from "@pages/content/hooks/useCapture";
import { useBlockSelectText } from "@pages/content/hooks/useBlockSelectText";
import { ResultPanel } from "@pages/content/components/result-panel/ResultPanel";
import { useMousePos } from "@pages/content/hooks/useMousePos";

export default function App() {
  const { isDragging, draggedArea, recognizedText } = useCapture();
  const { isSelectTextBlocking } = useBlockSelectText(isDragging);
  const { mousePos } = useMousePos();

  console.log("MOUSE POS", mousePos);

  return (
    <div className="content-view">
      {/** Show dragging area */}
      {isDragging && (
        <div
          style={{
            position: "fixed",
            border: "1px solid black",
            background: "rgba(0, 0, 0, 0.1)",
            ...draggedArea,
          }}
        ></div>
      )}
      {recognizedText && <ResultPanel recognizedText={recognizedText} mousePos={mousePos}></ResultPanel>}
    </div>
  );
}
