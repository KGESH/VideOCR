import { useEffect, useState } from "react";

export type MousePos = {
  x: number;
  y: number;
};

export const useMousePos = () => {
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent) => {
    setMousePos({
      x: e.pageX,
      y: e.pageY,
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return { mousePos };
};
