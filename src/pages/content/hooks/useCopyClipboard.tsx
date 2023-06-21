import { DependencyList, useEffect, useState } from "react";

type ContentType = "image" | "text";

export type HandleCopyClipboard = (content: string, contentType: ContentType) => void;

export const useCopyClipboard = (copiedResetEffectDeps?: DependencyList) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
  }, copiedResetEffectDeps);

  const copyToClipboard = async (content: string, contentType: ContentType) => {
    switch (contentType) {
      case "image":
        await copyImageToClipboard(content);
        break;

      case "text":
        await copyTextToClipboard(content);
        break;
    }

    setIsCopied(true);
  };

  return {
    isCopied,
    copyToClipboard,
  };
};

const copyImageToClipboard = async (imageUrl: string) => {
  const blob = await fetch(imageUrl).then((res) => res.blob());

  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
};

const copyTextToClipboard = async (text: string) => {
  /** HTTPS 환경에 따라 분기 */
  if (window.isSecureContext && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    unsecuredCopyTextToClipboard(text);
  }
};

const unsecuredCopyTextToClipboard = (text: string) => {
  console.log("unsecuredCopyTextToClipboard");
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};
