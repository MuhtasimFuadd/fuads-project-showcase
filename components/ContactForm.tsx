"use client";

import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not send your message.");
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-aqua/40 bg-aqua/5 p-6 text-paper/85">
        <p className="font-display text-xl text-aqua">Message sent — thank you!</p>
        <p className="mt-2 text-sm text-paper/60">I&apos;ll get back to you as soon as I can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-paper/70">
          Name
          <input name="name" required maxLength={120} className="field mt-1" />
        </label>
        <label className="block text-sm text-paper/70">
          Email
          <input name="email" type="email" required maxLength={200} className="field mt-1" />
        </label>
      </div>
      <label className="block text-sm text-paper/70">
        Message
        <textarea name="message" required rows={5} maxLength={4000} className="field mt-1" />
      </label>
      {/* Honeypot: invisible to people, tempting to bots. */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {state === "error" && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="btn btn-solid">
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
