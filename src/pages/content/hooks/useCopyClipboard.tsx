import { DependencyList, useEffect, useState } from "react";

type ContentType = "image" | "text";
export function useCopyClipboard(copiedResetEffectDeps?: DependencyList) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsCopied(false);
  }, copiedResetEffectDeps);

  const copy = async (content: string, contentType: ContentType) => {
    await copyToClipboard(content);
    setIsCopied(true);
  };

  return {
    isCopied,
    copy,
  };
}

async function copyToClipboard(text: string) {
  const blob = await fetch(text).then((res) => res.blob());

  // await navigator.clipboard.writeText(text);
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
}
