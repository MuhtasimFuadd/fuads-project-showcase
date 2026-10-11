"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
      <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-accent/15 blur-[100px]" />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-line bg-panel p-8"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display font-bold text-ink">F</span>
        <h1 className="mt-4 font-display text-2xl text-paper">Admin sign in</h1>
        <p className="mt-2 text-sm text-paper/50">
          Manage projects and content for Fuad&apos;s Project Showcase.
        </p>

        <label className="mt-6 block text-sm text-paper/70">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field mt-2"
            autoFocus
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-solid mt-6 w-full">
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
