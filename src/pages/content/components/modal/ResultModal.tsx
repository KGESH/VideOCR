import { ReactNode } from "react";

type Props = {
  x: number;
  y: number;
  isCopied: boolean;
  children: ReactNode;
};
export const ResultModal = ({ x, y, isCopied, children }: Props) => {
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
      <button>{isCopied ? `Copied!` : `Copy`}</button>
      {children}
    </div>
  );
};
