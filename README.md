# AI_PPT_Generator
<img width="1913" height="827" alt="Screenshot from 2026-05-11 23-25-07" src="https://github.com/user-attachments/assets/4c5cae59-99ce-4823-bb7c-f4d972f93042" />

Generate presentations from text.

AI_PPT_Generator is a full-stack web app that turns plain text or notes into slide decks. You describe what you want, pick style and tone, and the app uses AI to draft slides with titles, content, speaker notes, and image prompts. You can preview the deck in the browser, present in a fullscreen slideshow, and export a .pptx file.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | TanStack Start + TanStack Router (file-based routes, SSR) |
| UI | React 19, Tailwind CSS v4, Radix UI / shadcn-style components |
| Data & cache | TanStack Query, Prisma 7 + PostgreSQL |
| Auth | Better Auth (GitHub configured; Google UI present) |
| AI | Vercel AI SDK (`ai`, `@ai-sdk/google`) with Gemini for structured slide generation |
| Background jobs | Inngest for async `presentation/generate` |
| Images | Random Picsum URLs today; ImageKit helper stubbed in Inngest function |
| Export | PptxGenJS (.pptx) |
| Tooling | Vite 8, TypeScript, Vitest, ESLint (TanStack config), Prettier |

## Features

- Sign in with GitHub.
- Home (`/`) dashboard to list presentations, compose a prompt, choose slide count, style, tone, and layout, then create a deck.
- Presentation detail (`/presentations/:presentationId`) shows live status while Inngest generates slides; preview, edit, regenerate, delete, fullscreen, slideshow, and export to .pptx.
- Public-ish routes: `/login` and API paths (auth and Inngest). `/about` is a simple marketing page.
- Server functions for create/update/regenerate/delete presentation flows under `src/features/presentation`.

## Prerequisites

- Node.js 20.19+ (Prisma 7.8 requirement)
- pnpm (preferred; npm also works)
- PostgreSQL database
- Google AI (Gemini) API key
- Inngest dev server for background runs
- Optional OAuth apps (GitHub)
- Optional OpenAI API key if you enable image generation in `src/lib/generate-image.ts`

## Environment variables

Create a `.env` or `.env.local` in the project root.

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma |
| `BETTER_AUTH_SECRET` | Yes* | Secret for Better Auth sessions (*required for real auth) |
| `BETTER_AUTH_URL` | No | Base URL of your app (useful for OAuth callbacks) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | For GitHub sign-in | OAuth credentials |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google sign-in | OAuth credentials (enable provider in `src/lib/auth.ts`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API key for `@ai-sdk/google` |
| `OPENAI_API_KEY` | Optional | Required if you enable OpenAI image generation helper |
| `IMAGEKIT_BASE_URL` | Optional | Used only if you switch to ImageKit URLs in Inngest |
| `INNGEST_DEV` | Optional | Set to `1` for local Inngest dev server |

Better Auth / OAuth: configure provider dashboards so redirect URLs match your environment (for example, `http://localhost:3000/api/auth/callback/github`).

## Setup

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Configure environment
   Add the variables from the table above to `.env` or `.env.local`.

3. Database (Prisma)

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

   Or use migrations if you prefer:

   ```bash
   pnpm prisma migrate dev
   ```

4. Inngest (local development)

   ```bash
   npx inngest-cli@latest dev
   ```

   Point it at your app URL (for example, `http://localhost:3000`) so `presentation/generate` runs locally.

5. Start the app

   ```bash
   pnpm dev
   ```

   The dev server defaults to port 3000.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite dev server (TanStack Start) on port 3000 |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Vitest |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier write + ESLint fix |
| `pnpm check` | Prettier check |

## Project structure (high level)

```text
src/
  routes/                 # File-based routes (__root, index, login, presentations, api/*)
  features/presentation/  # UI, hooks, server actions, queries, export-pptx, templates/options
  integrations/           # TanStack Query provider, Inngest client + functions
  lib/                    # auth, image generation helper, db client
  middleware/             # Auth middleware helpers
  components/             # Shared UI (shadcn-style components)
  generated/prisma/       # Prisma client output
prisma/
  schema.prisma           # User, Presentation, Slide, Better Auth models
```

## How generation works (brief)

1. User submits a prompt on `/` and a presentation row is created with status `GENERATING`; an Inngest event `presentation/generate` is sent.
2. Inngest (`src/integrations/inngest/function.ts`) loads the presentation, calls Gemini with a structured schema, replaces slides in the database, and assigns image URLs (currently random Picsum URLs).
3. The detail page refetches to reflect `COMPLETED` status and renders the slides for preview/export.

## UI components (shadcn)

Add components with the CLI:

```bash
pnpm dlx shadcn@latest add button
```

## Testing, linting, and formatting

```bash
pnpm test
pnpm lint
pnpm format
pnpm check
```

## Learn more

- TanStack Start: https://tanstack.com/start
- TanStack Router: https://tanstack.com/router
- Better Auth: https://www.better-auth.com
- Inngest: https://www.inngest.com/docs
- Prisma: https://www.prisma.io/docs
- Vercel AI SDK: https://ai-sdk.dev/
- PptxGenJS: https://gitbrent.github.io/PptxGenJS/
