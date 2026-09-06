import type { MetadataRoute } from "next";
import { getAllJobs } from "@/lib/jobs";
import { getAllPosts } from "@/lib/posts";

const base = "https://careerliftpk.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllJobs();
  const posts = await getAllPosts();
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/jobs`, lastModified: new Date() },
    ...jobs.map((j) => ({
      url: `${base}/jobs/${j.slug}`,
      lastModified: new Date(j.postedAtISO)
    })),
    { url: `${base}/cv-builder`, lastModified: new Date() },
    { url: `${base}/cover-letter`, lastModified: new Date() },
    { url: `${base}/interview-prep`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAtISO)
    })),
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() }
  ];
}

