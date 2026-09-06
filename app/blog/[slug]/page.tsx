import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import * as React from "react";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAtISO,
    description: post.excerpt,
    author: { "@type": "Organization", name: "CareerLift Pakistan" }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <div className="mt-2 text-sm text-[rgb(var(--muted))]">
        {new Date(post.publishedAtISO).toLocaleDateString()}
      </div>

      <article className="mt-8 space-y-4">
        <Markdown content={post.content} />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

function Markdown({ content }: { content: string }) {
  // Tiny Markdown renderer for MVP: supports headings + lists + paragraphs.
  // Keeps the project free and dependency-light.
  const lines = content.split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  function flushList(key: string) {
    if (!list.length) return;
    out.push(
      <ul key={key}>
        {list.map((li, idx) => (
          <li key={idx}>{li}</li>
        ))}
      </ul>
    );
    list = [];
  }

  lines.forEach((line, i) => {
    const key = `l${i}`;
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList(`${key}-ul`);
    if (line.startsWith("### ")) out.push(<h3 key={key}>{line.slice(4)}</h3>);
    else if (line.startsWith("## "))
      out.push(<h2 key={key}>{line.slice(3)}</h2>);
    else if (line.trim() === "") out.push(<div key={key} />);
    else out.push(<p key={key}>{line}</p>);
  });
  flushList("end-ul");
  return <>{out}</>;
}
