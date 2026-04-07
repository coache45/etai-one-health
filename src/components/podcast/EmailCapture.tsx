"use client";

import { useState } from "react";
import type { PodcastConfig } from "@/lib/podcast/config";

interface Props {
  config: PodcastConfig;
}

export function EmailCapture({ config }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !config.mailerLiteFormAction) return;
    setStatus("loading");

    try {
      const formData = new FormData();
      formData.append("fields[email]", email);
      formData.append("ml-submit", "1");

      await fetch(config.mailerLiteFormAction, {
        method: "POST",
        body: formData,
        mode: "no-cors", // MailerLite doesn't return CORS headers; we trust submit succeeds
      });

      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  if (!config.mailerLiteFormAction) {
    return (
      <p className="text-sm text-[#ECE2C8]/50">
        Email signup opens with Episode 1 on {config.releaseDay}.
      </p>
    );
  }

  if (status === "ok") {
    return (
      <p className="font-serif text-xl text-[#EBC869]">
        You're in. Episode drops every {config.releaseDay} morning.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-full border border-[#C9A84C]/40 bg-[#0A1126] px-5 py-3 text-[#ECE2C8] placeholder-[#ECE2C8]/40 focus:border-[#C9A84C] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[#C9A84C] px-6 py-3 font-medium text-[#101A38] transition hover:bg-[#EBC869] disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
