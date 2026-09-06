"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Template = "Classic" | "Modern";

type CV = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  objective: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  certifications: string;
};

const STORAGE_KEY = "careerlift:cvDraft:v1";

const empty: CV = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  objective: "",
  education: "",
  experience: "",
  skills: "",
  languages: "",
  certifications: ""
};

const PDFDownload = dynamic(
  () => import("./pdf-download").then((mod) => mod.PDFDownload),
  {
    ssr: false,
    loading: () => (
      <Button type="button" disabled>
        Preparing PDF...
      </Button>
    )
  }
);

export default function CVBuilderPage() {
  const [template, setTemplate] = React.useState<Template>("Modern");
  const [cv, setCv] = React.useState<CV>(empty);
  const [ats, setAts] = React.useState(true);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        setCv({
          ...empty,
          ...(JSON.parse(raw) as CV)
        });
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
    } catch {}
  }, [cv]);

  function update<K extends keyof CV>(key: K, value: CV[K]) {
    setCv((previous) => ({
      ...previous,
      [key]: value
    }));
  }

  function reset() {
    if (!confirm("Reset CV draft?")) return;

    setCv(empty);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">CV Builder</h1>

      <p className="mt-2 text-[rgb(var(--muted))]">
        Build an ATS-friendly CV and export a PDF for free (no API keys).
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Field
                label="Full name"
                value={cv.fullName}
                onChange={(value) => update("fullName", value)}
              />

              <Field
                label="City"
                value={cv.city}
                onChange={(value) => update("city", value)}
              />

              <Field
                label="Email"
                value={cv.email}
                onChange={(value) => update("email", value)}
              />

              <Field
                label="Phone"
                value={cv.phone}
                onChange={(value) => update("phone", value)}
              />
            </div>

            <div className="mt-4 grid gap-3">
              <Textarea
                label="Objective / Summary"
                value={cv.objective}
                onChange={(value) => update("objective", value)}
                rows={3}
              />

              <Textarea
                label="Education"
                value={cv.education}
                onChange={(value) => update("education", value)}
                rows={4}
                placeholder={
                  "BS Computer Science — XYZ University (2022)\nIntermediate — ABC College (2018)"
                }
              />

              <Textarea
                label="Experience"
                value={cv.experience}
                onChange={(value) => update("experience", value)}
                rows={5}
                placeholder={
                  "Company — Role (2024–2026)\n- Achievement with numbers\n- Responsibility"
                }
              />

              <Textarea
                label="Skills (comma-separated)"
                value={cv.skills}
                onChange={(value) => update("skills", value)}
                rows={3}
                placeholder="React, Next.js, Excel, Customer Support..."
              />

              <Textarea
                label="Languages"
                value={cv.languages}
                onChange={(value) => update("languages", value)}
                rows={2}
                placeholder="English, Urdu"
              />

              <Textarea
                label="Certifications"
                value={cv.certifications}
                onChange={(value) => update("certifications", value)}
                rows={3}
                placeholder="Google Digital Marketing, Coursera..."
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Select
                label="Template"
                value={template}
                onChange={(value) => setTemplate(value as Template)}
                options={["Modern", "Classic"]}
              />

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={ats}
                    onChange={(event) => setAts(event.target.checked)}
                  />
                  ATS-friendly (single column)
                </label>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <PDFDownload
                cv={cv}
                template={template}
                ats={ats}
              />

              <Button
                type="button"
                variant="secondary"
                onClick={reset}
              >
                Reset
              </Button>
            </div>

            <div className="mt-4 text-xs text-[rgb(var(--muted))]">
              Your draft is saved locally in your browser (localStorage).
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
          </CardHeader>

          <CardContent>
            <Preview
              cv={cv}
              template={template}
              ats={ats}
            />
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
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-1">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-1">
        <textarea
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[rgb(var(--primary))]"
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-1">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 rounded-xl border bg-[rgb(var(--card))] px-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Preview({
  cv,
  template,
  ats
}: {
  cv: CV;
  template: Template;
  ats: boolean;
}) {
  const skills = cv.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="rounded-2xl border bg-white p-5 text-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-semibold">
            {cv.fullName || "Your Name"}
          </div>

          <div className="text-sm text-slate-600">
            {(cv.city || "City") +
              " · " +
              (cv.phone || "Phone") +
              " · " +
              (cv.email || "Email")}
          </div>
        </div>

        <div className="rounded-full border px-3 py-1 text-xs">
          {template} · {ats ? "ATS" : "Two-column"}
        </div>
      </div>

      {cv.objective ? (
        <Section title="Summary">
          <p className="whitespace-pre-wrap text-sm text-slate-700">
            {cv.objective}
          </p>
        </Section>
      ) : null}

      <div className={ats ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <div>
          <Section title="Experience">
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {cv.experience || "Add your experience here..."}
            </p>
          </Section>

          <Section title="Education">
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {cv.education || "Add your education here..."}
            </p>
          </Section>
        </div>

        <div>
          <Section title="Skills">
            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border px-2.5 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                Add your skills...
              </p>
            )}
          </Section>

          <Section title="Languages">
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {cv.languages || "English, Urdu"}
            </p>
          </Section>

          {cv.certifications ? (
            <Section title="Certifications">
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {cv.certifications}
              </p>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
