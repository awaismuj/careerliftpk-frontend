import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Career tips, CV guidance, interview preparation, and job search advice."
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        SEO-ready articles to attract free traffic.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{p.title}</CardTitle>
              <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                {new Date(p.publishedAtISO).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[rgb(var(--muted))]">{p.excerpt}</p>
              <div className="mt-4">
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-sm font-medium text-[rgb(var(--primary))] hover:underline"
                >
                  Read article →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

