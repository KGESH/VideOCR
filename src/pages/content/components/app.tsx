import React from "react";
import { useCapture } from "@pages/content/hooks/useCapture";
import { useEffect, useState } from "react";
import { MyModal, ResultModal } from "@pages/content/components/modal/ResultModal";
import { CursorPos, useCursor } from "@pages/content/hooks/useCursor";
import { DragArea } from "@pages/content/components/cursor/DragArea";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";

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
  const [modalPos, setModalPos] = useState<CursorPos>({ x: 0, y: 0 });
  const { cursorPos } = useCursor();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showModal = () => {
    if (!isOpen) {
      setModalPos(cursorPos);
      onOpen();
    }

    // setModalVisible(!modalVisible);
    // if (!modalVisible) setModalPos(cursorPos);
  };

  return (
    <ChakraProvider>
      <div className="content-view">
        <button onClick={showModal}>Show Modal</button>

        {/** Show dragging area */}
        {isDragging && <DragArea {...draggedArea} />}

        {/*{modalVisible && <ResultModal text={`hello`} {...modalPos}></ResultModal>}*/}
        {<MyModal isOpen={isOpen} onClose={onClose} text={`hello`} {...modalPos}></MyModal>}
      </div>
    </ChakraProvider>
  );
}
