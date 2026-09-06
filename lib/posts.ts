import type { Post } from "@/types/post";
import { ApiError, apiFetch } from "@/lib/api";

export async function getAllPosts(): Promise<Post[]> {
  return apiFetch<Post[]>("/api/posts", { revalidate: 60 });
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    return await apiFetch<Post>(`/api/posts/${encodeURIComponent(slug)}`, { revalidate: 60 });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}
