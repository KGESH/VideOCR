import { useEffect, useState } from "react";

export type CursorPos = { x: number; y: number };

export const useCursor = () => {
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return { cursorPos };
};
