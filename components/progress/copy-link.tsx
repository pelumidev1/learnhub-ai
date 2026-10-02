"use client";

import { useState } from "react";

/** Copies the public verify link, the thing a student pastes into a CV or DM. */
export function CopyLink({ url, className = "" }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this link:", url);
        }
      }}
      className={className}
    >
      {copied ? "Link copied" : "Copy verify link"}
    </button>
  );
}
