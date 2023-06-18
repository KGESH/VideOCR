import { useEffect } from "react";
import { useCapture } from "@pages/content/hooks/useCapture";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  useCapture();

  return <div className="content-view">my content view2</div>;
}
