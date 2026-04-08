"use client";

import { useEffect } from "react";
import type { PodcastConfig } from "@/lib/podcast/config";

interface Props {
  config: PodcastConfig;
}

declare global {
  interface Window {
    ml?: (...args: unknown[]) => void;
  }
}

export function EmailCapture({ config }: Props) {
  const { mailerLiteAccountId, mailerLiteFormId, releaseDay } = config;

  useEffect(() => {
    if (!mailerLiteAccountId) return;
    if (document.getElementById("mailerlite-universal")) return;

    const s = document.createElement("script");
    s.id = "mailerlite-universal";
    s.async = true;
    s.src = "https://assets.mailerlite.com/js/universal.js";
    s.onload = () => {
      window.ml?.("account", mailerLiteAccountId);
    };
    document.body.appendChild(s);
  }, [mailerLiteAccountId]);

  if (!mailerLiteAccountId || !mailerLiteFormId) {
    return (
      <p className="text-sm text-[#ECE2C8]/50">
        Email signup opens with Episode 1 on {releaseDay}.
      </p>
    );
  }

  return (
    <div
      className="ml-embedded mx-auto max-w-md"
      data-form={mailerLiteFormId}
    />
  );
}
