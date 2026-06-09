# CLAUDE.md — BinestarRD

Guidance for AI agents working in this repo. Read this first.

## What this is

**BinestarRD** (UI brand: "Bienestar RD") is a Spanish-language **mental-health provider directory for the Dominican Republic**. It connects patients to psychologists and psychiatrists. The product thesis is trust and transparency: verified specialists, transparent pricing, no intermediaries. Conversion happens by sending patients to a provider's **WhatsApp** to book.

### Launch model: claim-your-profile directory

Like Doctoralia/Healthgrades. We seed the database with publicly-findable real DR providers as **unclaimed** listings. A provider then **claims** their listing, is lightly verified, and from then on controls their own profile and can answer patient questions.

Provider lifecycle: `unclaimed → pending (claim submitted) → claimed (verified, owner controls it)`.

Decided product posture (do not silently reverse these):
- **Backend:** Supabase (Postgres + Auth + RLS).
- **Consent:** standard directory posture — seed from public sources, show an "unclaimed" state, provide a claim + removal-request path. Track `source` on each seeded row.
- **Verification:** lightweight at launch (email/WhatsApp identity confirmation via admin review). Tighten later.
- **Reviews:** build a **real** patient-review system. Never attach fabricated ratings to real named people.

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript (strict).
- **Styling:** **Tailwind v4** (via `@tailwindcss/postcss`, imported in `app/globals.css`) + CSS Modules (`*.module.css`) per route/component, plus global helpers (`.container`, `.btn-primary`, `.card`, brand CSS vars). Some inline styles (e.g. `components/header.tsx`). Prefer Tailwind utilities + CSS Modules over inline styles for new work.
- **Icons:** `lucide-react`. **Map:** `leaflet` + `react-leaflet` (client-only, see `components/map-wrapper.tsx`). **Validation:** `zod`.
- **Data (target):** `@supabase/ssr` + `@supabase/supabase-js`. Currently NOT wired — all data is hardcoded in `lib/mock-data.ts`.

### Supabase project
- Project ref: `nigjhvhpyowruhxytdpy` (org `bticwheycehnvyggzkcd`, region `us-east-1`, free tier).
- URL: `https://nigjhvhpyowruhxytdpy.supabase.co`
- Keys/env: see `.env.example`. Never commit real keys; use `.env.local`.
- A Supabase MCP connection is available for schema/migrations/logs.

## Routes (Spanish names — keep them Spanish)

| Path | Purpose | State |
|------|---------|-------|
| `/` | Home / hero / featured | mock data |
| `/busqueda` | Directory: filters + Leaflet map | mock data, client component |
| `/perfil/[slug]` | Provider profile + WhatsApp CTA | mock data |
| `/preguntas` | Q&A index | mock data |
| `/preguntas/[slug]` | Q&A detail + answers | mock data |
| `/preguntas/nueva` | Ask a question | mock data |
| `/provider/dashboard` | Provider portal | mock, all actions are `alert()` |
| `/admin` | Validation + moderation queues | mock, buttons inert |
| `/legal/privacidad` | Privacy policy | static |

Components: `header`, `logo`, `crisis-interceptor`, `map` / `map-wrapper`.

## Conventions

- **Data fetching:** Server Components read from Supabase directly. **Mutations:** Server Actions (or route handlers) — never the inert `alert()`/no-op pattern that's there now. Validate inputs with `zod`.
- **Auth/access:** enforce with **RLS** in Postgres, not just UI. Roles: `patient`, `provider`, `admin`. A provider may edit only the row where `owner_id = auth.uid()`. See `docs/data-model.md`.
- **Replacing mock data:** `lib/mock-data.ts` and `lib/utils.ts#getProviderById` are placeholders. Replace reads with typed Supabase queries; generate DB types into `lib/` and use them.
- **Spanish UI:** all user-facing copy is Spanish (DR context: ARS Humano/Universal/Senasa/Palic, RD$, Santo Domingo neighborhoods). Keep it that way.
- **TypeScript:** dynamic route `params` is a `Promise` in Next 16 — `await params`. Some files carry a dead non-Promise `PageProps` interface (e.g. `app/perfil/[slug]/page.tsx`); remove these, don't copy them.
- **Comments:** write almost none; only for non-obvious "why".

## Safety rules (must never regress)

1. **Crisis interceptor** (`components/crisis-interceptor.tsx`) — the Línea de Vida hotline CTA (809-200-1202) must remain on every page. This is a mental-health product.
2. **No fabricated reviews/ratings** on real named providers. Ratings come only from the real review system.
3. **Consent:** seeded providers must show an unclaimed state and have a removal path; store each row's `source`.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000)
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npx playwright test  # e2e (tests/e2e/*.spec.ts)
```

Before declaring work done: `npm run typecheck && npm run lint && npm run build` should pass, and relevant Playwright specs should be green.

## Known issues / tech debt (resolve deliberately, flag big ones)

- **Branding drift:** repo/title mix "BinestarRD" vs "Bienestar RD". Pick one.
- **Mock ratings** on real-ish people — remove when wiring reviews.

See `docs/data-model.md` for the schema and `docs/roadmap.md` for the phased plan.
