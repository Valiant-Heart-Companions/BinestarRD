import { createClient } from '@/lib/supabase/server';
import type { ProviderRole, ClaimStatus, UiProvider } from '@/lib/provider-types';

export type { ProviderRole, ClaimStatus, UiProvider } from '@/lib/provider-types';
export { roleLabel } from '@/lib/provider-types';

const SELECT =
  'id, slug, full_name, role, bio, location_text, neighborhood, lat, lng, price, whatsapp, phone, image_url, is_founding_member, claim_status, source, owner_id, provider_specialties ( specialties ( name ) ), provider_insurances ( insurances ( name ) )';

type ProviderRow = {
  id: string;
  slug: string;
  full_name: string;
  role: ProviderRole;
  bio: string | null;
  location_text: string | null;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  price: number | null;
  whatsapp: string | null;
  phone: string | null;
  image_url: string | null;
  is_founding_member: boolean;
  claim_status: ClaimStatus;
  source: string | null;
  owner_id: string | null;
  provider_specialties: { specialties: { name: string } | null }[] | null;
  provider_insurances: { insurances: { name: string } | null }[] | null;
};

type RatingInfo = { rating: number | null; reviewCount: number };

function mapRow(row: ProviderRow, ratings?: RatingInfo): UiProvider {
  return {
    id: row.id,
    slug: row.slug,
    name: row.full_name,
    role: row.role,
    specialties: (row.provider_specialties ?? [])
      .map((ps) => ps.specialties?.name)
      .filter((n): n is string => Boolean(n)),
    insurance: (row.provider_insurances ?? [])
      .map((pi) => pi.insurances?.name)
      .filter((n): n is string => Boolean(n)),
    location: row.location_text ?? '',
    neighborhood: row.neighborhood,
    coordinates:
      row.lat != null && row.lng != null ? [row.lat, row.lng] : null,
    price: row.price,
    isVerified: row.claim_status === 'claimed',
    isFoundingMember: row.is_founding_member,
    rating: ratings?.rating ?? null,
    reviewCount: ratings?.reviewCount ?? 0,
    image: row.image_url ?? '',
    bio: row.bio ?? '',
    whatsapp: row.whatsapp,
    phone: row.phone,
    claimStatus: row.claim_status,
    source: row.source,
    ownerId: row.owner_id,
  };
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function ratingsMap(
  supabase: SupabaseServerClient,
  ids: string[],
): Promise<Map<string, RatingInfo>> {
  const map = new Map<string, RatingInfo>();
  if (ids.length === 0) return map;
  const { data } = await supabase
    .from('provider_ratings')
    .select('provider_id, rating, review_count')
    .in('provider_id', ids);
  for (const r of data ?? []) {
    if (r.provider_id) {
      map.set(r.provider_id, {
        rating: r.rating,
        reviewCount: r.review_count ?? 0,
      });
    }
  }
  return map;
}

export async function getProviders(): Promise<UiProvider[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('providers')
    .select(SELECT)
    .eq('listing_status', 'active')
    .order('is_founding_member', { ascending: false })
    .order('full_name');
  if (error) throw error;
  const rows = (data ?? []) as unknown as ProviderRow[];
  const ratings = await ratingsMap(
    supabase,
    rows.map((r) => r.id),
  );
  return rows.map((r) => mapRow(r, ratings.get(r.id)));
}

export async function getFeaturedProviders(limit = 4): Promise<UiProvider[]> {
  const all = await getProviders();
  // Prefer founding members, then fill the grid with other active listings.
  const founders = all.filter((p) => p.isFoundingMember);
  const rest = all.filter((p) => !p.isFoundingMember);
  return [...founders, ...rest].slice(0, limit);
}

export async function getMyProvider(): Promise<UiProvider | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('providers')
    .select(SELECT)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as ProviderRow;
  const ratings = await ratingsMap(supabase, [row.id]);
  return mapRow(row, ratings.get(row.id));
}

export async function getProviderBySlug(
  slug: string,
): Promise<UiProvider | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('providers')
    .select(SELECT)
    .eq('slug', slug)
    .eq('listing_status', 'active')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as ProviderRow;
  const ratings = await ratingsMap(supabase, [row.id]);
  return mapRow(row, ratings.get(row.id));
}
