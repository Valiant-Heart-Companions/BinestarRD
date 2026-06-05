import { createClient } from '@/lib/supabase/server';
import type { ClaimStatus, ProviderRole } from '@/lib/provider-types';

export type ListingStatus = 'active' | 'hidden' | 'removal_requested';

export interface PendingClaim {
  id: string;
  createdAt: string;
  claimantEmail: string | null;
  claimantWhatsapp: string | null;
  message: string | null;
  providerName: string;
  providerSlug: string;
  providerRole: ProviderRole;
  providerLocation: string | null;
}

export interface ModQuestion {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: string | null;
  status: string;
  createdAt: string;
}

export interface ModAnswer {
  id: string;
  body: string;
  status: string;
  createdAt: string;
  questionTitle: string;
  providerName: string;
}

export interface ModReview {
  id: string;
  rating: number;
  body: string | null;
  status: string;
  createdAt: string;
  providerName: string;
}

export interface AdminStats {
  providersTotal: number;
  providersClaimed: number;
  providersPending: number;
  providersUnclaimed: number;
  foundingMembers: number;
  listingActive: number;
  listingHidden: number;
  listingRemovalRequested: number;
  questionsPublished: number;
  answersPublished: number;
  reviewsPublished: number;
}

// One pass over providers (a small, directory-sized table) plus three
// head-only counts for published content. All real numbers — no estimates.
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [providersRes, questionsRes, answersRes, reviewsRes] =
    await Promise.all([
      supabase
        .from('providers')
        .select('claim_status, listing_status, is_founding_member'),
      supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published'),
      supabase
        .from('answers')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published'),
      supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published'),
    ]);

  if (providersRes.error) throw providersRes.error;

  type ProviderCountRow = {
    claim_status: ClaimStatus;
    listing_status: ListingStatus;
    is_founding_member: boolean;
  };
  const rows = (providersRes.data ?? []) as ProviderCountRow[];

  const stats: AdminStats = {
    providersTotal: rows.length,
    providersClaimed: 0,
    providersPending: 0,
    providersUnclaimed: 0,
    foundingMembers: 0,
    listingActive: 0,
    listingHidden: 0,
    listingRemovalRequested: 0,
    questionsPublished: questionsRes.count ?? 0,
    answersPublished: answersRes.count ?? 0,
    reviewsPublished: reviewsRes.count ?? 0,
  };

  for (const r of rows) {
    if (r.claim_status === 'claimed') stats.providersClaimed++;
    else if (r.claim_status === 'pending') stats.providersPending++;
    else stats.providersUnclaimed++;

    if (r.listing_status === 'active') stats.listingActive++;
    else if (r.listing_status === 'hidden') stats.listingHidden++;
    else if (r.listing_status === 'removal_requested')
      stats.listingRemovalRequested++;

    if (r.is_founding_member) stats.foundingMembers++;
  }

  return stats;
}

export interface DirectoryListing {
  id: string;
  name: string;
  slug: string;
  role: ProviderRole;
  location: string | null;
  listingStatus: ListingStatus;
  claimStatus: ClaimStatus;
  source: string | null;
  updatedAt: string;
}

// Listings needing admin attention: removal requests (privacy promise) first,
// then anything currently hidden so it can be restored.
export async function getListingsNeedingAttention(): Promise<
  DirectoryListing[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('providers')
    .select(
      'id, full_name, slug, role, location_text, listing_status, claim_status, source, updated_at',
    )
    .in('listing_status', ['removal_requested', 'hidden'])
    .order('updated_at', { ascending: false });
  if (error) throw error;

  type Row = {
    id: string;
    full_name: string;
    slug: string;
    role: ProviderRole;
    location_text: string | null;
    listing_status: ListingStatus;
    claim_status: ClaimStatus;
    source: string | null;
    updated_at: string;
  };

  const rows = (data ?? []) as Row[];
  // removal_requested before hidden, regardless of timestamp.
  const weight = (s: ListingStatus) => (s === 'removal_requested' ? 0 : 1);
  return rows
    .map((r) => ({
      id: r.id,
      name: r.full_name,
      slug: r.slug,
      role: r.role,
      location: r.location_text,
      listingStatus: r.listing_status,
      claimStatus: r.claim_status,
      source: r.source,
      updatedAt: r.updated_at,
    }))
    .sort((a, b) => weight(a.listingStatus) - weight(b.listingStatus));
}

export async function getPendingClaims(): Promise<PendingClaim[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('claims')
    .select(
      'id, created_at, claimant_email, claimant_whatsapp, message, provider:providers ( full_name, slug, role, location_text )',
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) throw error;

  type Row = {
    id: string;
    created_at: string;
    claimant_email: string | null;
    claimant_whatsapp: string | null;
    message: string | null;
    provider: {
      full_name: string;
      slug: string;
      role: ProviderRole;
      location_text: string | null;
    } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((c) => ({
    id: c.id,
    createdAt: c.created_at,
    claimantEmail: c.claimant_email,
    claimantWhatsapp: c.claimant_whatsapp,
    message: c.message,
    providerName: c.provider?.full_name ?? '—',
    providerSlug: c.provider?.slug ?? '',
    providerRole: c.provider?.role ?? 'psychologist',
    providerLocation: c.provider?.location_text ?? null,
  }));
}

// Questions awaiting moderation: pending (new) or flagged.
export async function getModerationQuestions(): Promise<ModQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('questions')
    .select('id, slug, title, body, category, status, created_at')
    .in('status', ['pending', 'flagged'])
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    body: q.body,
    category: q.category,
    status: q.status,
    createdAt: q.created_at,
  }));
}

export async function getModerationAnswers(): Promise<ModAnswer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('answers')
    .select(
      'id, body, status, created_at, question:questions ( title ), provider:providers ( full_name )',
    )
    .in('status', ['pending', 'flagged'])
    .order('created_at', { ascending: true });
  if (error) throw error;

  type Row = {
    id: string;
    body: string;
    status: string;
    created_at: string;
    question: { title: string } | null;
    provider: { full_name: string } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((a) => ({
    id: a.id,
    body: a.body,
    status: a.status,
    createdAt: a.created_at,
    questionTitle: a.question?.title ?? '—',
    providerName: a.provider?.full_name ?? '—',
  }));
}

export async function getModerationReviews(): Promise<ModReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, body, status, created_at, provider:providers ( full_name )')
    .in('status', ['pending', 'flagged'])
    .order('created_at', { ascending: true });
  if (error) throw error;

  type Row = {
    id: string;
    rating: number;
    body: string | null;
    status: string;
    created_at: string;
    provider: { full_name: string } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    status: r.status,
    createdAt: r.created_at,
    providerName: r.provider?.full_name ?? '—',
  }));
}
