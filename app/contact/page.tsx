"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiError, apiFetch } from "@/lib/api";

type Msg = { name: string; email: string; message: string; atISO: string };
const KEY = "careerlift:contactMessages:v1";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [saved, setSaved] = React.useState<Msg[]>([]);
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw) as Msg[]);
    } catch {}
  }, []);

  async function submit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill all fields.");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      await apiFetch("/api/contact", { method: "POST", body: { name, email, message } });
      const next: Msg = { name, email, message, atISO: new Date().toISOString() };
      const list = [next, ...saved].slice(0, 20);
      setSaved(list);
      try {
        localStorage.setItem(KEY, JSON.stringify(list));
      } catch {}
      setMessage("");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not send your message. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        Send us a message and we&apos;ll get back to you.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name" value={name} onChange={setName} />
              <Field label="Email" value={email} onChange={setEmail} />
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[rgb(var(--primary))]"
                placeholder="How can we help?"
              />
            </div>

            {status === "sent" ? (
              <div className="mt-3 text-sm text-green-600">Message sent — thanks for reaching out!</div>
            ) : null}
            {status === "error" && error ? (
              <div className="mt-3 text-sm text-red-600">{error}</div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button type="button" onClick={submit} disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Submit"}
              </Button>
              <a
                className="inline-flex items-center justify-center rounded-xl border px-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-900/40"
                href="mailto:you@example.com"
              >
                Email instead
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent submissions (this device)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {saved.length ? (
              saved.map((m, idx) => (
                <div key={idx} className="rounded-2xl border p-3">
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {m.email} · {new Date(m.atISO).toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm text-[rgb(var(--muted))] whitespace-pre-wrap">
                    {m.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-[rgb(var(--muted))]">No messages yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1">
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
