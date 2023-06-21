import { useCapture } from "@pages/content/hooks/useCapture";
import { useEffect, useState } from "react";

export const useBlockSelectText = (isDragging: boolean) => {
  const [isSelectTextBlocking, setIsSelectTextBlocking] = useState(false);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
      setIsSelectTextBlocking(true);
    } else {
      document.body.style.userSelect = "";
      setIsSelectTextBlocking(false);
    }
  }, [isDragging]);

  return { isSelectTextBlocking };
};

export default function App() {
  const { isDragging, draggedArea } = useCapture();
  const { isSelectTextBlocking } = useBlockSelectText(isDragging);

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
    </div>
  );
}
