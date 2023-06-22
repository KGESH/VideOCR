import { useCapture } from "@pages/content/hooks/useCapture";
import { useEffect, useState } from "react";
import { ResultModal } from "@pages/content/components/modal/ResultModal";
import { CursorPos, useCursor } from "@pages/content/hooks/useCursor";
import { DragArea } from "@pages/content/components/cursor/DragArea";

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
  const { isDragging, draggedArea, isCopied } = useCapture();
  const { isSelectTextBlocking } = useBlockSelectText(isDragging);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPos, setModalPos] = useState<CursorPos>({ x: 0, y: 0 });
  const { cursorPos } = useCursor();

  const showModal = () => {
    setModalVisible(!modalVisible);
    if (!modalVisible) setModalPos(cursorPos);
  };

  return (
    <div className="content-view">
      <button onClick={showModal}>Show Modal</button>

      {/** Show dragging area */}
      {isDragging && <DragArea {...draggedArea} />}

      {modalVisible && (
        <ResultModal isCopied={isCopied} {...modalPos}>
          <p>{`hello world!`}</p>
        </ResultModal>
      )}
    </div>
  );
}
