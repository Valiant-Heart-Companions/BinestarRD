# Roadmap — BinestarRD to launch

Living checklist. Update as phases complete. See `docs/data-model.md` for schema, `CLAUDE.md` for conventions.

Status: harness done; features not started.

## Phase 0 — Harness (done)
- [x] `CLAUDE.md` conventions + safety rules
- [x] `docs/data-model.md` schema design
- [x] `docs/roadmap.md` (this file)
- [x] Supabase project provisioned (`nigjhvhpyowruhxytdpy`, free tier)
- [x] `typecheck` script + `.env.example`

## Phase 1 — Foundation (Supabase + real reads)
- [x] Apply schema migration (enums, tables, indexes, view, `is_admin()`)
- [x] Apply RLS policies
- [x] Seed specialties + insurances lookups
- [x] Tailwind v4 installed + wired (decision: Tailwind, not CSS-Modules-only)
- [x] `lib/supabase/server.ts` + `lib/supabase/client.ts` (@supabase/ssr)
- [x] Generate `lib/database.types.ts`
- [x] Seed real-but-limited providers (`unclaimed`, with `source`) — 9 across SDQ/Santiago/La Vega; `scripts/seed-data/providers.json` mirrors DB
- [x] Replace `lib/mock-data.ts` reads in `/`, `/busqueda`, `/perfil/[slug]`, `/preguntas`, `/preguntas/[slug]` with Supabase queries (data layer: `lib/providers.ts`, `lib/questions.ts`; client-safe types in `lib/provider-types.ts`). Route renamed `/perfil/[id]` → `/perfil/[slug]`. `admin` + `provider/dashboard` still on mock (their own phases).
- [x] Drop fabricated ratings; show real `provider_ratings` (or "Nuevo")
- [x] Unclaimed listings show a "Perfil no reclamado" notice + source link + claim/removal path (consent posture)
- [x] WhatsApp-or-phone CTA: WhatsApp when present, else public phone (`tel:`), seeded listings show landline

### Provider data sourcing (from research 2026-06-03)
Pull order: (1) **CODOPSI** colegiados list — public, authoritative real licensed names + province/mención; (2) **GuiaMedica.com.do** — open, specialty + Santo Domingo location + phone; (3) **Doctoralia** (manual) — rich profiles, but anti-scraping, gather carefully. Insurance-accepted rarely public → defer to direct outreach (friend). Legal: Ley 172-13 Art. 27/44 favors republishing minimal public professional info with source + opt-out.

## Phase 2 — Auth & claim flow
- [x] Supabase Auth (email magic link) — `signInWithOtp` + PKCE `/auth/callback` (`exchangeCodeForSession`); login at `/acceso`, sign-out server action; SSR session refresh via `proxy.ts` + `lib/supabase/middleware.ts` (Next 16 `proxy` convention, not deprecated `middleware`)
- [x] `profiles` row on signup — `handle_new_user` trigger on `auth.users` (default role `patient`); admin promotion via `scripts/promote-admin.mjs <email>` (user must sign in once first)
- [x] Provider claim flow: unclaimed perfil → "Reclama tu perfil" → `/perfil/[slug]/reclamar` → `claims` insert (status `pending`); `mark_provider_pending_on_claim` trigger flips provider to `pending`; perfil shows distinct "Reclamo en revisión" notice
- [x] Provider edits gated by `owner_id` (RLS-backed) — `getMyProvider()` reads the owner's row; dashboard shows real owned provider (save still mock until Phase 3)
- [x] Protect `/provider/dashboard` (auth + must own a provider) and `/admin` (role `admin`) by server-side gate; header shows login / Mi Portal / Salir / Admin

### Phase 2 config (manual, in Supabase dashboard)
- Auth → URL Configuration → Redirect URLs: add `http://localhost:3000/auth/callback` and the prod `https://<domain>/auth/callback`.
- Set `NEXT_PUBLIC_SITE_URL` in prod env (`.env.example` documents it; falls back to request origin locally).
- Default email magic-link template works (PKCE `code` param). Free-tier email is rate-limited; fine for launch volume.

## Phase 3 — Make it real
- [x] Provider dashboard: real profile save (Server Action, replaces `alert()`) — `updateMyProfile` (bio/price/whatsapp), RLS-gated to `owner_id`
- [x] Admin: real validation queue (approve/reject claims) + moderation (publish/flag/remove) — `lib/admin.ts` queues + `app/admin/actions.ts`; claim review via `approve_claim`/`reject_claim` RPCs (self-guarded with `is_admin()`)
- [x] Build `/preguntas/nueva` (anonymous ask → `questions` pending) — `submitQuestion` action, slugged, moderation-pending
- [x] Provider answers questions from dashboard inbox — `getInboxForProvider` + `answerQuestion` (answers go to pending)
- [x] Real patient-review system (submit → moderate → aggregate) — `submitReview` (pending, 1 per provider via UNIQUE, no self-review), `provider_ratings` view aggregates published; reviews shown on profile
- [x] Question/answer upvotes persist — `question_votes`/`answer_votes` with voter key (auth id or anon cookie), deduped by PK; counts read live, voted state disables button

Phase 3 verification: `typecheck` + `lint` (3 pre-existing `<img>` warnings) + `build` all green. Security advisors: only pre-existing WARNs (intentional permissive vote-insert policies; SECURITY DEFINER RPCs self-guard with `is_admin()`).

## Phase 4 — Launch polish
- [x] **Rethink design & messaging** — functional hero search (`app/hero-search.tsx`) replacing the dead prototype box; global site `Footer` (`components/footer.tsx` + module) in `layout.tsx`; hero search prefills `/busqueda` filters (`initialLocation`/`initialInsurance`). Home IA restructured: added a "Tu bienestar en tres pasos" trust/how-it-works section (Busca → Compara → Agenda por WhatsApp, `styles.steps*`) after the hero, and moved **Especialistas destacados** (the core product) above the Q&A section. Internal dashboard/admin visual polish can still be deepened later.
- [x] **Write new copy** — production copy pass across public surfaces: hero subtitle (WhatsApp booking, no intermediaries), how-it-works steps, section headers normalized to Spanish sentence case ("Especialistas destacados", "Preguntas de la comunidad"), profile "Sobre mí" → "Perfil profesional" (neutral for unclaimed/seeded rows) + "Seguros aceptados" + "Precio de consulta", directory list footer now invites specialists to join, footer copy. Deeper dashboard/admin copy can be revisited later.
- [x] SEO: per-page metadata, `sitemap.ts`, `robots.ts`, JSON-LD (Physician/LocalBusiness) for profiles — `lib/site.ts` (SITE_URL/NAME/DESC), `metadataBase` + title template + OG/Twitter in `layout.tsx`; per-page OG/canonical on profiles & questions; `app/robots.ts` (disallows admin/provider/auth/acceso/api); dynamic `app/sitemap.ts` (static + active providers + published questions, revalidate 1h); `Physician`/`MedicalBusiness` JSON-LD on profiles with `AggregateRating` only when real reviews exist
- [x] Branding: settle "Bienestar RD" everywhere; favicon — all UI copy already uses "Bienestar RD"; added `app/icon.svg` (brand green + gold "B")
- [x] Privacy policy reflects real data practices + removal path — rewritten `/legal/privacidad`: public-source seeding + unclaimed state, data collected (claims, auth, anon questions, reviews, voting cookie), no fabricated reviews, removal/correction path (claim or email), crisis notice. **NOTE:** contact email is placeholder `privacidad@bienestarrd.com` — set a real one before launch.
- [x] Playwright specs updated for real flows — rewrote admin/provider (auth redirect to `/acceso?next=`), visitor (directory → profile), Q&A (ask form), home, and added `seo-legal.spec.ts` (robots/sitemap/icon/privacy). 22 tests green (chromium + Mobile Chrome).
- [ ] Deploy to Vercel; set env vars; preview → production

## Deferred / not selected (available on request)
- CI/testing harness (GitHub Actions running typecheck/lint/build/e2e)
- Deploy harness (Vercel link, env management, preview flow)
- Stricter verification (document upload to Supabase Storage)
