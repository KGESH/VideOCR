import { ReactNode, useEffect, useState } from "react";
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
import { CursorPos, useCursor } from "@pages/content/hooks/useCursor";
import { CopyIcon, SettingsIcon } from "@chakra-ui/icons";

type Props = {
  x: number;
  y: number;
  text: string;
  isOpen: boolean;
  onClose: () => void;
};

export const MyModal = ({ x, y, text, isOpen, onClose }: Props) => {
  const { onCopy, setValue, hasCopied } = useClipboard("");

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/*<ModalOverlay />*/}
      <ModalContent left={x} top={y}>
        <ModalHeader>Recognized</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize={"sm"}>{text}</Text>
        </ModalBody>
        <ModalFooter>
          <Button leftIcon={<SettingsIcon />} colorScheme="gray" mr={3}>
            Settings
          </Button>
          <Button leftIcon={<CopyIcon />} onClick={onCopy} colorScheme="blue" mr={3}>
            {hasCopied ? `Copied!` : `Copy`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export const ResultModal = ({ x, y, text }: Props) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  useEffect(() => {
    setValue(text);
  }, [text]);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        // display: visible ? "block" : "none",
        top: y - 100,
        left: x + 100,
        backgroundColor: "gainsboro",
      }}
    >
      <Button onClick={onCopy}>{hasCopied ? `Copied!` : `Copy`}</Button>
      <p>{text}</p>
      <p>==================</p>
      <p>{value}</p>
    </div>
  );
};
