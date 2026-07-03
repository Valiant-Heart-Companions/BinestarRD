# Seed providers

Loads `providers.json` into Supabase as unclaimed listings.

## Prerequisites

The `provider-avatars` Storage bucket and its RLS policies must exist.
Migration `supabase/migrations/0001_provider_avatars_bucket.sql` was already
applied to the live project — nothing to do unless you're wiring a fresh project.

## Setup

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://nigjhvhpyowruhxytdpy.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service role key — Supabase dashboard → Project Settings → API>"
```

> The service role key bypasses RLS. Keep it server-side only — never commit it
> or expose it to the browser.

## Run

From the repo root:

```bash
npm install
node scripts/seed-providers.mjs
```

Expected output:

```
Seeded 46/46 providers.
```

4 of the 46 records have an `image` URL. The script downloads each with
browser-like headers and uploads it to the `provider-avatars` bucket under
`seed/<slug>`. If a CDN rejects a request you'll see a non-fatal warning:

```
  image fetch failed for <slug>: HTTP 403
```

The provider still seeds — it just renders the branded-initials avatar instead.

## Behaviour

- Inserts each row as **unclaimed** with its `source` URL (consent posture).
- **Idempotent** — upserts on `slug`. Safe to re-run. Only sets `image_url`
  when an image successfully ingests, so re-seeding never wipes a photo the
  provider already uploaded themselves.
- Auto-creates missing rows in the `specialties` lookup table and links them
  via `provider_specialties`.

## Verify

Load `/busqueda` — all 46 providers should appear, ~4 with photos and the rest
with initials avatars.

## Adding providers

Edit `providers.json`. Each record:

```jsonc
{
  "full_name": "Dra. Ana Pérez",
  "role": "psychologist",           // or "psychiatrist"
  "specialties": ["Ansiedad"],
  "location_text": "Naco, Santo Domingo",
  "neighborhood": "Naco",
  "phone": "8096860651",            // optional
  "whatsapp": "8095550101",         // optional, digits only
  "license_number": "12345",        // optional
  "image": "https://…/photo.jpg",   // optional — downloaded at seed time
  "source": "https://…"             // required — public page this data came from
}
```
