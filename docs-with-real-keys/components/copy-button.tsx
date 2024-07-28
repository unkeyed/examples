"use client";

import { cn } from "@/lib/utils";
import { Copy, CopyCheck } from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  src?: string;
}

async function copyToClipboardWithMeta(
  value: string,
  _meta?: Record<string, unknown>,
) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({
  value,
  className,
  src,
  children,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <button
      aria-label="Copy code snippet"
      type="button"
      onClick={() => {
        copyToClipboardWithMeta(value, {
          component: src,
        });
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <CopyCheck className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
