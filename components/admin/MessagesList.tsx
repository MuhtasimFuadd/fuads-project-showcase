"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type MessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function MessagesList({ messages }: { messages: MessageRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(m: MessageRow) {
    setBusy(m.id);
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !m.is_read })
    });
    setBusy(null);
    router.refresh();
  }
  async function remove(m: MessageRow) {
    if (!confirm("Delete this message?")) return;
    setBusy(m.id);
    await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (messages.length === 0) {
    return <p className="rounded-2xl border border-dashed border-line p-10 text-center text-paper/55">No messages yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li key={m.id} className={`rounded-2xl border p-5 ${m.is_read ? "border-line bg-panel" : "border-accent/40 bg-accent/5"} ${busy === m.id ? "opacity-50" : ""}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-base text-paper">
              {m.name}{" "}
              <a href={`mailto:${m.email}`} className="font-body text-sm text-accent-light hover:underline">
                {m.email}
              </a>
            </p>
            <time className="font-mono text-xs text-paper/40">
              {new Date(m.created_at).toLocaleString()}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-paper/75">{m.message}</p>
          <div className="mt-4 flex gap-2 text-xs">
            <button onClick={() => toggle(m)} className="rounded-full border border-line px-3 py-1 text-paper/70 hover:text-paper">
              {m.is_read ? "Mark unread" : "Mark read"}
            </button>
            <a href={`mailto:${m.email}?subject=Re: your message`} className="rounded-full border border-line px-3 py-1 text-paper/70 hover:text-paper">
              Reply
            </a>
            <button onClick={() => remove(m)} className="rounded-full border border-line px-3 py-1 text-paper/50 hover:border-red-500/60 hover:text-red-400">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
