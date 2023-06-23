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
