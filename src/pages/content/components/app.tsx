import React, { useEffect } from "react";
import { useCapture } from "@pages/content/hooks/useCapture";
import { useState } from "react";
import { ResultModal } from "@pages/content/components/modal/ResultModal";
import { DragArea } from "@pages/content/components/cursor/DragArea";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { useBlockSelectText } from "@pages/content/hooks/useBlockSelectText";
import { CaptureArea } from "@pages/content/types/Capture";

export default function App() {
  // const [isRecognizing, setIsRecognizing] = useState(false);
  // const [recognizedDone, setRecognizedDone] = useState(false);
  // const handleRecognizing = (isProcessing: boolean) => setIsRecognizing(isProcessing);
  // const handleRecognizedDone = (done: boolean) => setRecognizedDone(done);
  const [modalPos, setModalPos] = useState<CaptureArea>({ top: 0, left: 0, width: 0, height: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isDragging, draggedArea, recognizedText, isRecognizing, recognizedDone } = useCapture();
  const { isSelectTextBlocking } = useBlockSelectText(isDragging);

  const showModal = () => {
    if (!isOpen && recognizedDone) {
      setModalPos(draggedArea);
      onOpen();
    }
  };

  useEffect(() => {
    showModal();
  }, [recognizedDone, draggedArea]);

  return (
    <ChakraProvider>
      <div className="content-view">
        {/** Show dragging area */}
        {isDragging && !isRecognizing && <DragArea {...draggedArea} />}

        {recognizedDone && !isRecognizing && (
          <ResultModal isOpen={isOpen} onClose={onClose} text={recognizedText} {...modalPos}></ResultModal>
        )}
      </div>
    </ChakraProvider>
  );
}
