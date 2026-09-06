// Small fetch helper for talking to the CareerLiftPK backend API.
// Set NEXT_PUBLIC_API_URL in .env.local (see .env.example).

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
  /** Next.js data cache behaviour. Defaults to "no-store" for freshness. */
  cache?: RequestCache;
  revalidate?: number;
};

export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const { body, token, headers, revalidate, cache, ...rest } = opts;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    cache: revalidate !== undefined ? undefined : cache ?? "no-store",
    next: revalidate !== undefined ? { revalidate } : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const message = (data && (data.error as string)) || res.statusText || "Request failed";
    throw new ApiError(res.status, message, data?.details);
  }

  return data as T;
}
