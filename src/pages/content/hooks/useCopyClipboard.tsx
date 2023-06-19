import { DependencyList, useEffect, useState } from "react";

type ContentType = "image" | "text";

export function useCopyClipboard(copiedResetEffectDeps?: DependencyList) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
  }, copiedResetEffectDeps);

  const copy = async (content: string, contentType: ContentType) => {
    switch (contentType) {
      case "image":
        await copyImageToClipboard(content);
        break;

      case "text":
        await copyToClipboard(content);
        break;
    }

    setIsCopied(true);
  };

  return {
    isCopied,
    copy,
  };
}

const copyImageToClipboard = async (imageUrl: string) => {
  const blob = await fetch(imageUrl).then((res) => res.blob());

  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};
