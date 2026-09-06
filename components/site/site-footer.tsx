import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-semibold">CareerLift Pakistan</div>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Free career tools for Pakistan: jobs, CV builder, cover letters, and
              interview preparation.
            </p>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Links</div>
            <ul className="mt-2 space-y-1 text-[rgb(var(--muted))]">
              <li>
                <Link href="/jobs" className="hover:underline">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/cv-builder" className="hover:underline">
                  CV Builder
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Monetization (placeholders)</div>
            <p className="mt-2 text-[rgb(var(--muted))]">
              This MVP includes placeholder areas for sponsored jobs, featured
              employers, and ad banners.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t pt-6 text-xs text-[rgb(var(--muted))] md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} CareerLift Pakistan</div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

