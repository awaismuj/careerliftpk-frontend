"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Item = { q: string; a: string };
export type InterviewPack = { category: string; items: Item[] };

function pickRandom<T>(arr: T[], count: number) {
  const copy = [...arr];
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, Math.min(count, copy.length));
}

export function InterviewPrepClient({ packs }: { packs: InterviewPack[] }) {
  const [category, setCategory] = React.useState(packs[0]?.category ?? "");
  const [mock, setMock] = React.useState<Item[] | null>(null);

  const current = packs.find((p) => p.category === category) ?? packs[0];

  function startMock() {
    const all = packs.flatMap((p) => p.items);
    setMock(pickRandom(all, 5));
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Interview Preparation</h1>
        <p className="mt-2 text-[rgb(var(--muted))]">No interview content available yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Interview Preparation</h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        Common questions + sample answers (template-based) and a mock interview checklist.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {packs.map((p) => (
                <button
                  key={p.category}
                  onClick={() => {
                    setCategory(p.category);
                    setMock(null);
                  }}
                  className={[
                    "text-left rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900/40",
                    category === p.category
                      ? "border-[rgb(var(--primary))] text-[rgb(var(--primary))]"
                      : ""
                  ].join(" ")}
                >
                  {p.category}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Button type="button" variant="secondary" onClick={startMock}>
                Start mock interview (5 Qs)
              </Button>
            </div>

            <div className="mt-4 text-xs text-[rgb(var(--muted))]">
              Tip: Use STAR (Situation, Task, Action, Result) for behavioral questions.
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          {mock ? (
            <Card>
              <CardHeader>
                <CardTitle>Mock interview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mock.map((it, idx) => (
                  <div key={idx} className="rounded-2xl border p-4">
                    <div className="font-medium">Q{idx + 1}. {it.q}</div>
                    <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                      Checklist:
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>Answer is structured (STAR / bullet points)</li>
                        <li>Mentions a real example</li>
                        <li>Includes numbers (time, %, results)</li>
                        <li>Ends with what you learned / next step</li>
                      </ul>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Type your answer here..."
                      className="mt-3 w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[rgb(var(--primary))]"
                    />
                  </div>
                ))}
                <Button type="button" onClick={() => setMock(null)}>
                  End mock
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{current.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {current.items.map((it) => (
                  <div key={it.q} className="rounded-2xl border p-4">
                    <div className="font-medium">{it.q}</div>
                    <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                      {it.a}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
