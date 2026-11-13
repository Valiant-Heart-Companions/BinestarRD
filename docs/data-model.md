# Data Model — BinestarRD (Supabase)

Design doc. **Nothing here is applied yet** — agree on this before running migrations.
Maps the current `lib/mock-data.ts` shapes onto a real schema with the claim-profile
lifecycle and RLS by role.

## Roles

Stored on `profiles` (1:1 with `auth.users`):

- `patient` — default for any signed-up user; can ask questions, leave reviews.
- `provider` — owns exactly one `providers` row (`owner_id = auth.uid()`).
- `admin` — full access; runs validation + moderation queues.

Most public reads are anonymous (no login needed to browse the directory).

## Tables

### `profiles`
| col | type | notes |
|-----|------|-------|
| id | uuid PK | = `auth.users.id` |
| role | enum `user_role` | `patient` \| `provider` \| `admin`, default `patient` |
| display_name | text | |
| created_at | timestamptz | default now() |

### `providers`
| col | type | notes |
|-----|------|-------|
| id | uuid PK | |
| slug | text unique | for `/perfil/[slug]` (prefer slug over raw id) |
| full_name | text | |
| role | enum `provider_role` | `psychologist` \| `psychiatrist` |
| bio | text | |
| location_text | text | e.g. "Naco, Santo Domingo" |
| neighborhood | text | filter facet |
| lat | double precision | map |
| lng | double precision | map |
| price | integer null | RD$, null when "Consultar" |
| phone | text null | primary contact: clinic/landline or mobile (seeded from public sources) |
| whatsapp | text null | digits only; set ONLY when the number is known to be on WhatsApp. Null otherwise — the UI uses this as the signal to offer a direct WhatsApp link rather than assuming any phone reaches WhatsApp. |
| image_url | text | |
| is_founding_member | boolean | default false |
| license_number | text null | exequátur / CODOPSI / MD license |
| claim_status | enum `claim_status` | `unclaimed` \| `pending` \| `claimed`, default `unclaimed` |
| listing_status | enum `listing_status` | `active` \| `hidden` \| `removal_requested`, default `active` |
| source | text | where seeded from (consent posture) |
| owner_id | uuid null FK profiles(id) | set when claimed |
| created_at / updated_at | timestamptz | |

> Note: NO `rating` / `review_count` columns — those are derived from `reviews` (see view below). The mock `isVerified` maps to `claim_status = 'claimed'`.

### `specialties` / `provider_specialties`
- `specialties(id uuid pk, name text unique)`
- `provider_specialties(provider_id fk, specialty_id fk, pk(provider_id, specialty_id))`

### `insurances` / `provider_insurances`
- `insurances(id uuid pk, name text unique)` — Humano, Universal, Senasa, Palic, …
- `provider_insurances(provider_id fk, insurance_id fk, pk(...))`

### `questions`
| col | type | notes |
|-----|------|-------|
| id | uuid PK | |
| slug | text unique | |
| title | text | |
| body | text | |
| category | text | |
| author_id | uuid null FK profiles | null = anonymous ask |
| status | enum `content_status` | `pending` \| `published` \| `flagged` \| `removed` |
| created_at | timestamptz | |

Upvotes: `question_votes(question_id, voter_key, pk(...))` (voter_key = user id or anon cookie), count via aggregate. Same pattern for answers.

### `answers`
| col | type | notes |
|-----|------|-------|
| id | uuid PK | |
| question_id | uuid FK questions | |
| provider_id | uuid FK providers | only claimed providers may answer |
| body | text | |
| status | enum `content_status` | |
| created_at | timestamptz | |

### `reviews` (the real rating system)
| col | type | notes |
|-----|------|-------|
| id | uuid PK | |
| provider_id | uuid FK providers | |
| author_id | uuid FK profiles | one review per author per provider (unique) |
| rating | smallint | 1–5 (check constraint) |
| body | text | |
| status | enum `content_status` | moderated before public |
| created_at | timestamptz | |

`provider_ratings` view: `select provider_id, avg(rating)::numeric(2,1) as rating, count(*) as review_count from reviews where status='published' group by provider_id`.

### `claims`
| col | type | notes |
|-----|------|-------|
| id | uuid PK | |
| provider_id | uuid FK providers | |
| claimant_id | uuid null FK profiles | |
| claimant_email | text | |
| claimant_whatsapp | text | |
| message | text | |
| status | enum `claim_status_review` | `pending` \| `approved` \| `rejected` |
| reviewed_by | uuid null FK profiles | admin |
| created_at | timestamptz | |

On approval: set `providers.owner_id`, `claim_status='claimed'`, and `profiles.role='provider'`.

## RLS posture

Enable RLS on all tables. Sketch:

- **providers**
  - `SELECT`: anon/auth where `listing_status = 'active'`.
  - `UPDATE`: `auth.uid() = owner_id` (restrict editable cols: bio, price, phone, whatsapp, image_url, location_text, neighborhood, lat, lng, specialties/insurance joins) OR admin.
  - `INSERT`/seed/`DELETE`: admin / service role only.
- **questions/answers/reviews**: public `SELECT` only where `status = 'published'`. `INSERT` by authenticated (answers: only by a provider who owns the `provider_id`). `UPDATE status` (moderation): admin only. Authors may edit their own pending content.
- **claims**: `INSERT` by anyone (claiming a listing); `SELECT`/`UPDATE`: claimant sees own, admin sees all.
- **profiles**: user reads/updates own; admin reads all. `role` only changeable by admin/service role.
- **admin check**: helper `is_admin()` = `exists(select 1 from profiles where id = auth.uid() and role='admin')`.

## Migration / seed plan (Phase 1)

1. Enums + tables + indexes (`slug`, `neighborhood`, `provider_id` FKs, `status`).
2. `provider_ratings` view + `is_admin()` helper.
3. RLS policies.
4. Seed `specialties` / `insurances` lookup rows.
5. Seed real-but-limited providers as `unclaimed` with `source`.
6. Generate TS types → `lib/database.types.ts`; build typed query helpers in `lib/supabase/`.
