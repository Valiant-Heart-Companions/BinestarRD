/**
 * Seed providers into Supabase from scripts/seed-data/providers.json.
 *
 * Each record is inserted as an UNCLAIMED listing with its public `source`.
 * Specialties are matched by name against the `specialties` lookup table
 * (unknown names are created). Idempotent: upserts on `slug`.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-providers.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the env
 * (the service role key bypasses RLS — never expose it to the browser).
 *
 * Record shape (scripts/seed-data/providers.json — array of):
 *   {
 *     "full_name": "Dra. Ana Pérez",
 *     "role": "psychologist" | "psychiatrist",
 *     "specialties": ["Ansiedad", "Terapia de Pareja"],
 *     "location_text": "Naco, Santo Domingo, Distrito Nacional",
 *     "neighborhood": "Naco",
 *     "phone": "8096860651",          // optional: public clinic/landline number
 *     "whatsapp": "8095550101",      // optional, digits only
 *     "license_number": "12345",      // optional
 *     "image": "https://.../photo.jpg", // optional: downloaded into the
 *                                       // provider-avatars bucket at seed time
 *     "source": "https://..."         // required: public page it came from
 *   }
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^(dra?|lic|ing|mtra?)\.?\s+/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function specialtyIdMap(names) {
  const unique = [...new Set(names)];
  if (unique.length === 0) return new Map();
  await supabase.from('specialties').upsert(
    unique.map((name) => ({ name })),
    { onConflict: 'name', ignoreDuplicates: true },
  );
  const { data, error } = await supabase
    .from('specialties')
    .select('id, name')
    .in('name', unique);
  if (error) throw error;
  return new Map(data.map((s) => [s.name, s.id]));
}

// Best-effort: download a public image URL and store it in the provider-avatars
// bucket under seed/<slug>. Runs with the service role key so it bypasses RLS.
// Returns the public URL (cache-busted) or null on any failure.
async function ingestImage(slug, url) {
  try {
    // Browser-like headers: some CDNs (e.g. Wix) use referer-based hotlink
    // protection and reject bare requests for otherwise-public image assets.
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
        Referer: new URL(url).origin + '/',
      },
    });
    if (!res.ok) {
      console.warn(`  image fetch failed for ${slug}: HTTP ${res.status}`);
      return null;
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!/^image\//.test(contentType)) {
      console.warn(`  image url for ${slug} is not an image (${contentType})`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const path = `seed/${slug}`;
    const { error } = await supabase.storage
      .from('provider-avatars')
      .upload(path, buf, { upsert: true, contentType });
    if (error) {
      console.warn(`  image upload failed for ${slug}: ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from('provider-avatars').getPublicUrl(path);
    return `${data.publicUrl}?v=${Date.now()}`;
  } catch (e) {
    console.warn(`  image error for ${slug}: ${e.message}`);
    return null;
  }
}

async function main() {
  const raw = await readFile(join(__dirname, 'seed-data', 'providers.json'), 'utf8');
  const records = JSON.parse(raw);
  if (!Array.isArray(records) || records.length === 0) {
    console.log('No seed records found. Nothing to do.');
    return;
  }

  const allSpecialties = records.flatMap((r) => r.specialties ?? []);
  const specMap = await specialtyIdMap(allSpecialties);

  let ok = 0;
  for (const r of records) {
    if (!r.source) {
      console.warn(`Skipping "${r.full_name}" — missing required source URL.`);
      continue;
    }
    const slug = slugify(r.full_name);
    // Only set image_url when we successfully ingest one, so re-seeding without
    // an image never wipes a photo the provider already uploaded.
    const imageUrl = r.image ? await ingestImage(slug, r.image) : null;
    const { data: provider, error } = await supabase
      .from('providers')
      .upsert(
        {
          slug,
          full_name: r.full_name,
          role: r.role,
          location_text: r.location_text ?? null,
          neighborhood: r.neighborhood ?? null,
          phone: r.phone ?? null,
          whatsapp: r.whatsapp ?? null,
          license_number: r.license_number ?? null,
          source: r.source,
          claim_status: 'unclaimed',
          listing_status: 'active',
          ...(imageUrl ? { image_url: imageUrl } : {}),
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single();
    if (error) {
      console.error(`Failed "${r.full_name}":`, error.message);
      continue;
    }
    const specIds = (r.specialties ?? [])
      .map((n) => specMap.get(n))
      .filter(Boolean)
      .map((specialty_id) => ({ provider_id: provider.id, specialty_id }));
    if (specIds.length) {
      await supabase
        .from('provider_specialties')
        .upsert(specIds, { ignoreDuplicates: true });
    }
    ok += 1;
  }
  console.log(`Seeded ${ok}/${records.length} providers.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
