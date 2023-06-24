import { useEffect, useRef, useState } from "react";
import { Button, Text, useClipboard, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CopyIcon, SettingsIcon } from "@chakra-ui/icons";
import { CaptureArea } from "@pages/content/types/Capture";

type Props = CaptureArea & {
  text: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ResultModal = ({ top, left, width, height, text, isOpen, onClose }: Props) => {
  const { onCopy, setValue, hasCopied } = useClipboard("");

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false} scrollBehavior={"inside"}>
      {/*<ModalOverlay />*/}
      <ModalContent position={"fixed"} left={left + width} top={top}>
        <ModalHeader>Recognized</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize={"sm"}>{text}</Text>
        </ModalBody>
        <ModalFooter>
          <Button leftIcon={<CopyIcon />} onClick={onCopy} colorScheme="blue" mr={3} autoFocus>
            {hasCopied ? `Copied!` : `Copy`}
          </Button>
          <Button leftIcon={<SettingsIcon />} colorScheme="gray" mr={3}>
            Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
