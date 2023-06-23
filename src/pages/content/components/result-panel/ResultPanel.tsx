import React from "react";
import { MousePos } from "@pages/content/hooks/useMousePos";

type Props = { recognizedText: string; mousePos: MousePos };
export const ResultPanel = ({ recognizedText, mousePos }: Props) => {
  console.log("ResultPanel", mousePos, recognizedText);
  return (
    <div
      className="popup show"
      style={{
        left: `${mousePos.x}`,
        top: `${mousePos.y}`,
      }}
    >
      <div>{recognizedText}</div>
    </div>
  );
};
