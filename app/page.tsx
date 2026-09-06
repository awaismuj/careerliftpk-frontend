import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, Sparkles, Users } from "lucide-react";

const features = [
  {
    title: "Free CV Builder",
    desc: "Create an ATS-friendly CV with a clean, modern template and export PDF.",
    icon: FileText
  },
  {
    title: "Daily Job Updates",
    desc: "Browse sample job listings (MVP) and a structure ready for real updates.",
    icon: Briefcase
  },
  {
    title: "Cover Letter Drafts",
    desc: "Generate strong cover letter drafts using smart templates—no paid AI needed.",
    icon: Sparkles
  },
  {
    title: "Interview Prep",
    desc: "Role-based questions, sample answers, and a mock interview checklist.",
    icon: Users
  }
];

const faqs = [
  {
    q: "Is CareerLift Pakistan free?",
    a: "Yes. This MVP is designed to work fully without paid services or API keys."
  },
  {
    q: "Does it use real AI?",
    a: "The site uses high-quality templates and personalization rules. You can also copy prompts to use with ChatGPT/Gemini free (manually)."
  },
  {
    q: "Can I monetize it later?",
    a: "Yes. The UI includes placeholders for ads, sponsored jobs, and premium templates."
  }
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border bg-[rgb(var(--card))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
            <Badge className="border-0 bg-[rgb(var(--accent))] text-white">
              Free
            </Badge>
            No paid APIs · Netlify-ready · Pakistan-focused
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Find Jobs. Build CV. Grow Career.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[rgb(var(--muted))] md:text-lg">
            Pakistan’s smart career platform for jobs, CV creation, cover letters,
            and interview success—built to run free.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/cv-builder" size="lg">
              Create CV
            </ButtonLink>
            <ButtonLink href="/jobs" size="lg" variant="secondary">
              Browse Jobs
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>10+</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[rgb(var(--muted))]">
                Seed job listings (MVP)
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[rgb(var(--muted))]">
                CV templates (free)
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>50+</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[rgb(var(--muted))]">
                Interview questions
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[rgb(var(--muted))]">
                Blog + schema + sitemap
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-semibold">Everything you need</h2>
          <p className="mt-2 text-[rgb(var(--muted))]">
            A premium look with a free-first architecture.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{f.title}</CardTitle>
                    <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                      {f.desc}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Testimonials</h2>
              <p className="mt-2 text-[rgb(var(--muted))]">
                Sample testimonials for the MVP.
              </p>
              <div className="mt-4 grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>“My CV looks professional now.”</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-[rgb(var(--muted))]">
                    I exported a clean PDF and used the interview prep checklist
                    before my interview.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>“Cover letter drafts saved time.”</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-[rgb(var(--muted))]">
                    The templates helped me write a strong letter without paying
                    for tools.
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">FAQ</h2>
              <p className="mt-2 text-[rgb(var(--muted))]">
                Common questions about the free-first approach.
              </p>
              <div className="mt-4 grid gap-4">
                {faqs.map((f) => (
                  <Card key={f.q}>
                    <CardHeader>
                      <CardTitle>{f.q}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-[rgb(var(--muted))]">
                      {f.a}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-3xl border bg-[rgb(var(--card))] p-8 md:p-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xl font-semibold">
                  Ready to build your CV?
                </div>
                <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                  Export an ATS-friendly PDF in minutes.
                </div>
              </div>
              <div className="flex gap-3">
                <ButtonLink href="/cv-builder" size="lg">
                  Start CV Builder
                </ButtonLink>
                <ButtonLink href="/jobs" size="lg" variant="secondary">
                  Browse Jobs
                </ButtonLink>
              </div>
            </div>
            <div className="mt-6 text-xs text-[rgb(var(--muted))]">
              Adsense placeholder: 728×90 banner area (add later).
            </div>
            <div className="mt-2 h-20 rounded-2xl border bg-slate-50 dark:bg-slate-900/40" />
          </div>
        </div>
      </section>
    </div>
  );
}

