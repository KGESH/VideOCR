import { useEffect } from "react";
import { useCapture } from "@pages/content/hooks/useCapture";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  const { isDrawing, rectangle } = useCapture();

  return (
    <div className="content-view">
      {isDrawing && (
        <div
          style={{
            position: "absolute",
            border: "1px solid black",
            background: "rgba(0, 0, 0, 0.1)",
            ...rectangle,
          }}
        ></div>
      )}
    </div>
  );
}
