import { createClient } from '@/lib/supabase/server';
import type { ProviderRole } from '@/lib/provider-types';

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
