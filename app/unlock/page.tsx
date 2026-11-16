"use client";

import Link from "next/link";
import { useState } from "react";

export default function UnlockPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus("ok");
      setMessage("Unlocked on this browser for 30 days.");
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-th-bg p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-th-border bg-th-card p-6 shadow-lg"
      >
        <h1 className="font-serif text-2xl text-th-text">BrandSignal</h1>
        <p className="mt-1 text-sm text-th-text-secondary">
          Owner unlock. Live searches use paid credits, so only the owner can run them.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Owner password"
          autoComplete="current-password"
          className="mt-5 w-full rounded-lg border border-th-border bg-th-card-alt px-3 py-2 text-sm text-th-text outline-none focus:border-th-accent"
        />
        <button
          type="submit"
          disabled={status === "busy" || !password}
          className="mt-3 w-full rounded-lg bg-th-accent px-3 py-2 text-sm font-medium text-white hover:bg-th-accent-hover disabled:opacity-50"
        >
          {status === "busy" ? "Checking…" : "Unlock"}
        </button>
        {message && (
          <p className={`mt-3 text-sm ${status === "ok" ? "text-th-success" : "text-th-danger"}`}>
            {message}{" "}
            {status === "ok" && (
              <Link href="/" className="font-medium text-th-text-accent underline">
                Open dashboard
              </Link>
            )}
          </p>
        )}
      </form>
    </main>
  );
}
