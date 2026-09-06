# CareerLift Pakistan (CareerLiftPK) — Frontend

Job + CV + Cover Letter + Interview Prep website built with Next.js. This is
the **frontend only** — jobs, blog posts, interview-prep content, and contact
messages are served by a separate backend API.

> Looking for the backend? See the `careerliftpk-backend` repo. This app
> won't show real data until it's pointed at a running backend instance.

## Features
- Jobs listing with search + filters + saved jobs (localStorage)
- Job detail pages with `JobPosting` schema JSON-LD
- CV Builder with live preview + free PDF export (client-side, unchanged)
- Cover Letter generator (template-based) + Copy Prompt button
- Interview preparation library + mock interview checklist (data from the API)
- Blog with SEO posts + `BlogPosting` schema JSON-LD (data from the API)
- Contact form that submits to the backend's `/api/contact` endpoint
- Admin dashboard (`/admin`) with real login (JWT) and CRUD against the API
- Dark mode, `sitemap.xml`, `robots.txt`

## Tech
- Next.js App Router + TypeScript
- Tailwind CSS
- next-themes
- @react-pdf/renderer
- Data comes from the backend API (`lib/api.ts`, `lib/jobs.ts`, `lib/posts.ts`)

## Local setup

1. Install Node.js (LTS)
2. Copy the env file and point it at your backend:

   ```bash
   cp .env.example .env.local
   # edit NEXT_PUBLIC_API_URL if your backend isn't on localhost:4000
   ```

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

4. Make sure the backend is running first (see its README) — pages that
   fetch jobs/posts/interview content will error otherwise.

Open `http://localhost:3000`.

## Deploying

Deploy this repo like any Next.js app (Netlify, Vercel, etc.). Set
`NEXT_PUBLIC_API_URL` in your host's environment variables to your deployed
backend's public URL, and make sure the backend's `CORS_ORIGIN` includes this
site's URL.

### Netlify
- Build command: `npm run build`
- Publish directory: `.next`
- This repo includes `netlify.toml` with `@netlify/plugin-nextjs`.

## Editing content

Jobs, blog posts, and interview-prep content are now managed through the
`/admin` dashboard (log in with the admin credentials configured on the
backend) rather than by editing local JSON files.

## Future upgrade roadmap
- Real job ingestion (RSS, scraping with permission, or partner submissions)
- Multiple admin accounts / roles
- Payments (premium templates, CV review, sponsored listings)
