"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function CopyButton({
  value,
  label = "Copy",
  className,
  disabled,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function onCopy() {
    if (!value || disabled) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={onCopy}
      disabled={disabled || !value}
      className={className}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}
