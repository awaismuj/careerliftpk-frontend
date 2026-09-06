import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobBySlug } from "@/lib/jobs";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} — ${job.city}`,
    description: `Apply for ${job.title} at ${job.company} in ${job.city}.`
  };
}

export default async function JobDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAtISO,
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company
    },
    jobLocation: job.city === "Remote"
      ? { "@type": "Place", name: "Remote" }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city,
            addressCountry: "PK"
          }
        }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{job.title}</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">
            {job.company} · {job.city} · {job.type}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{job.category}</Badge>
            {job.salaryPKR ? <Badge>PKR {job.salaryPKR}</Badge> : null}
            {job.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <ButtonLink
            href={`/cover-letter?title=${encodeURIComponent(
              job.title
            )}&company=${encodeURIComponent(job.company)}`}
            variant="secondary"
          >
            Cover Letter
          </ButtonLink>
          <ButtonLink href="/interview-prep">Interview Prep</ButtonLink>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Job description</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[rgb(var(--muted))]">
            {job.description}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-[rgb(var(--muted))] space-y-1">
              {job.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Apply</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {job.applyUrl ? (
              <Link
                href={job.applyUrl}
                target="_blank"
                className="text-sm font-medium text-[rgb(var(--primary))] hover:underline"
              >
                Apply link
              </Link>
            ) : (
              <div className="text-sm text-[rgb(var(--muted))]">
                Apply link not available in the MVP seed data.
              </div>
            )}
            <div className="text-xs text-[rgb(var(--muted))]">
              Tip: use the Cover Letter page to draft a strong application.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-sm">
        <Link href="/jobs" className="text-[rgb(var(--muted))] hover:underline">
          ← Back to jobs
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
