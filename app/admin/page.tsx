"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api";
import type { Job } from "@/types/job";
import type { Post } from "@/types/post";

const TOKEN_KEY = "careerlift:adminToken";

type ContactMessage = { id: string; name: string; email: string; message: string; createdAt: string };
type InterviewPack = { category: string; items: { q: string; a: string }[] };

export default function AdminPage() {
  const [token, setToken] = React.useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) setToken(stored);
    } catch {}
    setCheckedStorage(true);
  }, []);

  function handleLogin(t: string) {
    setToken(t);
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {}
  }

  function handleLogout() {
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }

  if (!checkedStorage) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin</h1>
        {token ? (
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-[rgb(var(--muted))]">
        Manage jobs, blog posts, interview-prep content, and contact messages — backed by the
        CareerLiftPK API.
      </p>

      <div className="mt-6">
        {token ? <Dashboard token={token} onUnauthorized={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: { email, password }
      });
      onLogin(res.token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Admin login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="mt-1">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="mt-1">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
          </div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Dashboard({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [tab, setTab] = React.useState<"jobs" | "posts" | "interview" | "messages">("jobs");

  function handleAuthError(err: unknown) {
    if (err instanceof ApiError && err.status === 401) {
      onUnauthorized();
      return true;
    }
    return false;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(["jobs", "posts", "interview", "messages"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "rounded-xl border px-4 py-2 text-sm capitalize hover:bg-slate-50 dark:hover:bg-slate-900/40",
              tab === t ? "border-[rgb(var(--primary))] text-[rgb(var(--primary))]" : ""
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "jobs" && <JobsTab token={token} onAuthError={handleAuthError} />}
        {tab === "posts" && <PostsTab token={token} onAuthError={handleAuthError} />}
        {tab === "interview" && <InterviewTab token={token} onAuthError={handleAuthError} />}
        {tab === "messages" && <MessagesTab token={token} onAuthError={handleAuthError} />}
      </div>
    </div>
  );
}

const emptyJob: Omit<Job, "id"> = {
  slug: "",
  title: "",
  company: "",
  city: "",
  category: "IT",
  type: "Full-time",
  salaryPKR: "",
  postedAtISO: new Date().toISOString().slice(0, 10),
  tags: [],
  description: "",
  requirements: [],
  applyUrl: ""
};

function JobsTab({ token, onAuthError }: { token: string; onAuthError: (err: unknown) => boolean }) {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [editing, setEditing] = React.useState<Job | (typeof emptyJob) | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Job[]>("/api/jobs");
      setJobs(data);
    } catch (err) {
      if (!onAuthError(err)) setError("Could not load jobs.");
    } finally {
      setLoading(false);
    }
  }, [onAuthError]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this job?")) return;
    try {
      await apiFetch(`/api/jobs/${id}`, { method: "DELETE", token });
      load();
    } catch (err) {
      if (!onAuthError(err)) alert("Failed to delete job.");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Jobs ({jobs.length})</h2>
        <Button type="button" onClick={() => setEditing(emptyJob)}>
          + Add job
        </Button>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {loading ? (
        <div className="text-sm text-[rgb(var(--muted))]">Loading...</div>
      ) : (
        <div className="grid gap-3">
          {jobs.map((j) => (
            <Card key={j.id}>
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm text-[rgb(var(--muted))]">
                    {j.company} · {j.city} · {j.slug}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(j)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(j.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editing ? (
        <JobForm
          token={token}
          value={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onAuthError={onAuthError}
        />
      ) : null}
    </div>
  );
}

function JobForm({
  token,
  value,
  onCancel,
  onSaved,
  onAuthError
}: {
  token: string;
  value: Job | typeof emptyJob;
  onCancel: () => void;
  onSaved: () => void;
  onAuthError: (err: unknown) => boolean;
}) {
  const [form, setForm] = React.useState(value);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isEdit = "id" in form;

  function set<K extends keyof typeof form>(key: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      tags: Array.isArray(form.tags) ? form.tags : String(form.tags).split(",").map((t) => t.trim()).filter(Boolean),
      requirements: Array.isArray(form.requirements)
        ? form.requirements
        : String(form.requirements).split("\n").map((t) => t.trim()).filter(Boolean)
    };
    try {
      if (isEdit) {
        await apiFetch(`/api/jobs/${(form as Job).id}`, { method: "PUT", token, body: payload });
      } else {
        await apiFetch("/api/jobs", { method: "POST", token, body: payload });
      }
      onSaved();
    } catch (err) {
      if (!onAuthError(err)) setError(err instanceof ApiError ? err.message : "Failed to save job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit job" : "New job"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <TextField label="Title" value={form.title} onChange={(v) => set("title", v)} />
          <TextField label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <TextField label="Company" value={form.company} onChange={(v) => set("company", v)} />
          <TextField label="City" value={form.city} onChange={(v) => set("city", v)} />
          <TextField label="Category" value={form.category} onChange={(v) => set("category", v as Job["category"])} />
          <TextField label="Type" value={form.type} onChange={(v) => set("type", v as Job["type"])} />
          <TextField label="Salary (PKR)" value={form.salaryPKR ?? ""} onChange={(v) => set("salaryPKR", v)} />
          <TextField label="Posted date (ISO)" value={form.postedAtISO} onChange={(v) => set("postedAtISO", v)} />
          <TextField
            label="Tags (comma-separated)"
            value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
            onChange={(v) => set("tags", v as any)}
          />
          <TextField label="Apply URL" value={form.applyUrl ?? ""} onChange={(v) => set("applyUrl", v)} />
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Requirements (one per line)</label>
            <textarea
              value={Array.isArray(form.requirements) ? form.requirements.join("\n") : form.requirements}
              onChange={(e) => set("requirements", e.target.value as any)}
              rows={4}
              className="mt-1 w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>

          {error ? <div className="md:col-span-2 text-sm text-red-600">{error}</div> : null}

          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const emptyPost: Omit<Post, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  publishedAtISO: new Date().toISOString().slice(0, 10),
  content: "",
  tags: []
};

function PostsTab({ token, onAuthError }: { token: string; onAuthError: (err: unknown) => boolean }) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [editing, setEditing] = React.useState<Post | (typeof emptyPost) | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Post[]>("/api/posts");
      setPosts(data);
    } catch (err) {
      if (!onAuthError(err)) setError("Could not load posts.");
    } finally {
      setLoading(false);
    }
  }, [onAuthError]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await apiFetch(`/api/posts/${id}`, { method: "DELETE", token });
      load();
    } catch (err) {
      if (!onAuthError(err)) alert("Failed to delete post.");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blog posts ({posts.length})</h2>
        <Button type="button" onClick={() => setEditing(emptyPost)}>
          + Add post
        </Button>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {loading ? (
        <div className="text-sm text-[rgb(var(--muted))]">Loading...</div>
      ) : (
        <div className="grid gap-3">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-[rgb(var(--muted))]">{p.slug}</div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(p)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(p.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editing ? (
        <PostForm
          token={token}
          value={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onAuthError={onAuthError}
        />
      ) : null}
    </div>
  );
}

function PostForm({
  token,
  value,
  onCancel,
  onSaved,
  onAuthError
}: {
  token: string;
  value: Post | typeof emptyPost;
  onCancel: () => void;
  onSaved: () => void;
  onAuthError: (err: unknown) => boolean;
}) {
  const [form, setForm] = React.useState(value);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isEdit = "id" in form;

  function set<K extends keyof typeof form>(key: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      tags: Array.isArray(form.tags) ? form.tags : String(form.tags).split(",").map((t) => t.trim()).filter(Boolean)
    };
    try {
      if (isEdit) {
        await apiFetch(`/api/posts/${(form as Post).id}`, { method: "PUT", token, body: payload });
      } else {
        await apiFetch("/api/posts", { method: "POST", token, body: payload });
      }
      onSaved();
    } catch (err) {
      if (!onAuthError(err)) setError(err instanceof ApiError ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit post" : "New post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <TextField label="Title" value={form.title} onChange={(v) => set("title", v)} />
          <TextField label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <TextField label="Published date (ISO)" value={form.publishedAtISO} onChange={(v) => set("publishedAtISO", v)} />
          <TextField
            label="Tags (comma-separated)"
            value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
            onChange={(v) => set("tags", v as any)}
          />
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Content (Markdown-ish)</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={10}
              className="mt-1 w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
            />
          </div>

          {error ? <div className="md:col-span-2 text-sm text-red-600">{error}</div> : null}

          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function InterviewTab({ token, onAuthError }: { token: string; onAuthError: (err: unknown) => boolean }) {
  const [packs, setPacks] = React.useState<InterviewPack[]>([]);
  const [text, setText] = React.useState("[]");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiFetch<InterviewPack[]>("/api/interview");
        setPacks(data);
        setText(JSON.stringify(data, null, 2));
      } catch (err) {
        if (!onAuthError(err)) setError("Could not load interview content.");
      } finally {
        setLoading(false);
      }
    })();
  }, [onAuthError]);

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const parsed = JSON.parse(text);
      await apiFetch("/api/interview", { method: "PUT", token, body: parsed });
      setMessage("Saved.");
    } catch (err) {
      if (!onAuthError(err)) {
        setError(err instanceof ApiError ? err.message : "Invalid JSON or failed to save.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview prep content ({packs.length} categories)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[rgb(var(--muted))]">
          Edit the full JSON array below (category + Q&amp;A items), then save — this replaces the
          whole interview-prep dataset.
        </p>
        {loading ? (
          <div className="text-sm text-[rgb(var(--muted))]">Loading...</div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={18}
            className="w-full rounded-2xl border bg-[rgb(var(--card))] px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
          />
        )}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        {message ? <div className="text-sm text-green-600">{message}</div> : null}
        <Button type="button" onClick={save} disabled={saving || loading}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}

function MessagesTab({ token, onAuthError }: { token: string; onAuthError: (err: unknown) => boolean }) {
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiFetch<ContactMessage[]>("/api/contact", { token });
        setMessages(data);
      } catch (err) {
        if (!onAuthError(err)) setError("Could not load messages.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, onAuthError]);

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-semibold">Contact messages ({messages.length})</h2>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {loading ? (
        <div className="text-sm text-[rgb(var(--muted))]">Loading...</div>
      ) : messages.length ? (
        messages.map((m) => (
          <Card key={m.id}>
            <CardContent className="py-4">
              <div className="text-sm font-medium">{m.name}</div>
              <div className="text-xs text-[rgb(var(--muted))]">
                {m.email} · {new Date(m.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-[rgb(var(--muted))] whitespace-pre-wrap">{m.message}</div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-sm text-[rgb(var(--muted))]">No messages yet.</div>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1">
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
