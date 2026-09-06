"use client";

import * as React from "react";
import Link from "next/link";
import type { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { jobCategories, jobCities, jobTypes } from "@/lib/jobs";

type Props = {
  jobs: Job[];
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

function useLocalStorageSet(key: string) {
  const [set, setSet] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setSet(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, [key]);

  function toggle(id: string) {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(key, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  return { set, toggle };
}

export function JobsClient({ jobs }: Props) {
  const [q, setQ] = React.useState("");
  const [city, setCity] = React.useState<string>("All");
  const [category, setCategory] = React.useState<string>("All");
  const [type, setType] = React.useState<string>("All");
  const [sort, setSort] = React.useState<"newest" | "salaryHigh">("newest");

  const { set: saved, toggle } = useLocalStorageSet("careerlift:savedJobs");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = jobs.filter((j) => {
      if (query) {
        const hay = `${j.title} ${j.company} ${j.city} ${j.category} ${j.tags.join(
          " "
        )}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (city !== "All" && j.city !== city) return false;
      if (category !== "All" && j.category !== category) return false;
      if (type !== "All" && j.type !== type) return false;
      return true;
    });

    if (sort === "salaryHigh") {
      list = list.sort((a, b) => (b.salaryPKR ?? "").localeCompare(a.salaryPKR ?? ""));
    } else {
      list = list.sort((a, b) => b.postedAtISO.localeCompare(a.postedAtISO));
    }
    return list;
  }, [jobs, q, city, category, type, sort]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Keyword</label>
              <div className="mt-1">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. React, accountant, support"
                />
              </div>
            </div>

            <FilterSelect
              label="City"
              value={city}
              onChange={setCity}
              options={["All", ...jobCities]}
            />
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={["All", ...jobCategories]}
            />
            <FilterSelect
              label="Type"
              value={type}
              onChange={setType}
              options={["All", ...jobTypes]}
            />
            <FilterSelect
              label="Sort"
              value={sort}
              onChange={(v) => setSort(v as any)}
              options={[
                { value: "newest", label: "Newest" },
                { value: "salaryHigh", label: "Salary (High)" }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-[rgb(var(--muted))]">
        Showing <span className="font-medium text-[rgb(var(--fg))]">{filtered.length}</span>{" "}
        jobs
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((j) => {
          const isSaved = saved.has(j.id);
          return (
            <Card key={j.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{j.title}</CardTitle>
                    <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                      {j.company} · {j.city} · {j.type}
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(j.id)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-900/40",
                      isSaved && "border-[rgb(var(--accent))] text-[rgb(var(--accent))]"
                    )}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{j.category}</Badge>
                  {j.salaryPKR ? <Badge>PKR {j.salaryPKR}</Badge> : null}
                  <Badge>Posted {formatDate(j.postedAtISO)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[rgb(var(--muted))]">{j.description}</p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/jobs/${j.slug}`}
                    className="text-sm font-medium text-[rgb(var(--primary))] hover:underline"
                  >
                    View details
                  </Link>
                  <Link
                    href={`/cover-letter?title=${encodeURIComponent(
                      j.title
                    )}&company=${encodeURIComponent(j.company)}`}
                    className="text-sm font-medium text-[rgb(var(--accent))] hover:underline"
                  >
                    Draft cover letter
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options:
    | string[]
    | {
        value: string;
        label: string;
      }[];
}) {
  const normalized =
    typeof options[0] === "string"
      ? (options as string[]).map((o) => ({ value: o, label: o }))
      : (options as { value: string; label: string }[]);
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border bg-[rgb(var(--card))] px-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
        >
          {normalized.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

