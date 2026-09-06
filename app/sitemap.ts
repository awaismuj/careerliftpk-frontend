import type { MetadataRoute } from "next";
import { getAllJobs } from "@/lib/jobs";
import { getAllPosts } from "@/lib/posts";

const base = "https://careerliftpk.netlify.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let jobs: Awaited<ReturnType<typeof getAllJobs>> = [];
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];

  try {
    jobs = await getAllJobs();
  } catch (error) {
    console.error("Failed to load jobs for sitemap:", error);
    jobs = [];
  }

  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("Failed to load posts for sitemap:", error);
    posts = [];
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/jobs`, lastModified: new Date() },
    { url: `${base}/cv-builder`, lastModified: new Date() },
    { url: `${base}/cover-letter`, lastModified: new Date() },
    { url: `${base}/interview-prep`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() }
  ];

  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${base}/jobs/${job.slug}`,
    lastModified: new Date(job.postedAtISO)
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAtISO)
  }));

  return [...staticPages, ...jobPages, ...blogPages];
}
