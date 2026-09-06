"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Level = "Fresher" | "Junior" | "Mid" | "Senior";
type Tone = "Professional" | "Friendly";

function buildCoverLetter(input: {
  fullName: string;
  city: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  level: Level;
  skills: string;
  achievements: string;
  tone: Tone;
}) {
  const {
    fullName,
    city,
    phone,
    email,
    jobTitle,
    company,
    level,
    skills,
    achievements,
    tone
  } = input;

  const greeting = "Dear Hiring Manager,";
  const intro =
    tone === "Friendly"
      ? `I’m excited to apply for the ${jobTitle} role at ${company}.`
      : `I am writing to apply for the ${jobTitle} position at ${company}.`;

  const levelLine =
    level === "Fresher"
      ? "As a motivated fresher, I have built strong fundamentals and practical projects."
      : `With ${level.toLowerCase()}-level experience, I bring a track record of delivering results.`;

  const skillsLine = skills.trim()
    ? `My relevant skills include: ${skills.trim()}.`
    : "My relevant strengths include problem-solving, communication, and a learning mindset.";

  const achLine = achievements.trim()
    ? `Highlights: ${achievements.trim()}.`
    : "I focus on measurable impact—improving quality, speed, or customer outcomes.";

  const close =
    tone === "Friendly"
      ? `I’d love to discuss how I can help ${company}. Thank you for your time and consideration.`
      : `I would welcome the opportunity to discuss how I can contribute to ${company}. Thank you for your consideration.`;

  const signOff = "Sincerely,";

  return [
    fullName,
    city ? `${city}` : "",
    phone ? `${phone}` : "",
    email ? `${email}` : "",
    "",
    greeting,
    "",
    intro,
    "",
    levelLine,
    skillsLine,
    achLine,
    "",
    close,
    "",
    signOff,
    fullName
  ]
    .filter((l) => l !== "")
    .join("\n");
}

function buildPrompt(
  jobTitle: string,
  company: string,
  skills: string,
  achievements: string
) {
  return `Write a professional cover letter for the role: "${jobTitle}" at "${company}".\n\nMy skills: ${skills || "(add skills)"}\nMy achievements: ${achievements || "(add achievements)"}\n\nRequirements:\n- Keep it 250–350 words\n- Use a clear structure\n- Make it specific to the role and company\n- Include 2 measurable achievements\n- End with a confident close`;
}

function CoverLetterContent() {
  const sp = useSearchParams();

  const [fullName, setFullName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState(sp.get("title") ?? "");
  const [company, setCompany] = React.useState(sp.get("company") ?? "");
  const [level, setLevel] = React.useState<Level>("Junior");
  const [tone, setTone] = React.useState<Tone>("Professional");
  const [skills, setSkills] = React.useState("");
  const [achievements, setAchievements] = React.useState("");
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    setOutput(
      buildCoverLetter({
        fullName: fullName || "Your Name",
        city,
        phone,
        email,
        jobTitle: jobTitle || "Job Title",
        company: company || "Company",
        level,
        skills,
        achievements,
        tone
      })
    );
  }, [
    fullName,
    city,
    phone,
    email,
    jobTitle,
    company,
    level,
    skills,
    achievements,
    tone
  ]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed. Please select and copy manually.");
    }
  }

  const prompt = buildPrompt(
    jobTitle || "Job Title",
    company || "Company",
    skills,
    achievements
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Cover Letter</h1>

      <p className="mt-2 text-[rgb(var(--muted))]">
        Free template-based cover letter drafts + a copyable prompt for
        ChatGPT/Gemini free.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                placeholder="e.g. Ali Khan"
              />

              <Field
                label="City"
                value={city}
                onChange={setCity}
                placeholder="e.g. Lahore"
              />

              <Field
                label="Phone"
                value={phone}
                onChange={setPhone}
                placeholder="e.g. +92 300 1234567"
              />

              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="e.g. ali@email.com"
              />

              <Field
                label="Job title"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="e.g. Frontend Developer"
              />

              <Field
                label="Company"
                value={company}
                onChange={setCompany}
                placeholder="e.g. ABC Pvt Ltd"
              />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Select
                label="Experience level"
                value={level}
                onChange={(v) => setLevel(v as Level)}
                options={["Fresher", "Junior", "Mid", "Senior"]}
              />

              <Select
                label="Tone"
                value={tone}
                onChange={(v) => setTone(v as Tone)}
                options={["Professional", "Friendly"]}
              />
            </div>

            <div className="mt-4 grid gap-3">
              <Textarea
                label="Key skills (comma-separated)"
                value={skills}
                onChange={setSkills}
                placeholder="React, Next.js, Tailwind, Customer support, Excel..."
              />

              <Textarea
                label="Achievements (2–3 bullet ideas)"
                value={achievements}
                onChange={setAchievements}
                placeholder="Increased sales by 20%, Reduced response time from 2h to 30m..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Draft</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => copy(output)}
              >
                Copy draft
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => copy(prompt)}
              >
                Copy prompt (for ChatGPT free)
              </Button>
            </div>

            <pre className="mt-4 whitespace-pre-wrap rounded-2xl border bg-slate-50 p-4 text-sm text-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
              {output}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10">
          Loading...
        </div>
      }
    >
      <CoverLetterContent />
    </Suspense>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border bg-[rgb(var(--card))] px-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[rgb(var(--primary))]"
        />
      </div>
    </div>
  );
}
