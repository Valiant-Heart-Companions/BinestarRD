import { createClient } from '@/lib/supabase/server';
import { getVoterKey } from '@/lib/voter';
import type { ProviderRole } from '@/lib/providers';

export interface UiAnswer {
  id: string;
  body: string;
  upvotes: number;
  providerName: string;
  providerRole: ProviderRole;
  providerSlug: string;
  providerVerified: boolean;
  providerImageUrl: string | null;
}

export interface UiQuestion {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: string | null;
  createdAt: string;
  upvotes: number;
  answerCount: number;
  answers: UiAnswer[];
}

function countOf(rel: { count: number }[] | null | undefined): number {
  return rel?.[0]?.count ?? 0;
}

// Question ids the current voter has already upvoted.
export async function getVotedQuestionIds(): Promise<Set<string>> {
  const voterKey = await getVoterKey();
  if (!voterKey) return new Set();
  const supabase = await createClient();
  const { data } = await supabase
    .from('question_votes')
    .select('question_id')
    .eq('voter_key', voterKey);
  return new Set((data ?? []).map((v) => v.question_id));
}

// Answer ids the current voter has already upvoted.
export async function getVotedAnswerIds(): Promise<Set<string>> {
  const voterKey = await getVoterKey();
  if (!voterKey) return new Set();
  const supabase = await createClient();
  const { data } = await supabase
    .from('answer_votes')
    .select('answer_id')
    .eq('voter_key', voterKey);
  return new Set((data ?? []).map((v) => v.answer_id));
}

export async function getPublishedQuestions(): Promise<UiQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, slug, title, body, category, created_at, answers(count), question_votes(count)',
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    body: q.body,
    category: q.category,
    createdAt: q.created_at,
    upvotes: countOf(q.question_votes as unknown as { count: number }[]),
    answerCount: countOf(q.answers as unknown as { count: number }[]),
    answers: [],
  }));
}

export interface InboxQuestion {
  id: string;
  slug: string;
  title: string;
  category: string | null;
}

// Published questions this provider has not yet answered (any answer status).
export async function getInboxForProvider(
  providerId: string,
): Promise<InboxQuestion[]> {
  const supabase = await createClient();

  const { data: answered } = await supabase
    .from('answers')
    .select('question_id')
    .eq('provider_id', providerId);
  const answeredIds = new Set((answered ?? []).map((a) => a.question_id));

  const { data, error } = await supabase
    .from('questions')
    .select('id, slug, title, category')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;

  return (data ?? [])
    .filter((q) => !answeredIds.has(q.id))
    .map((q) => ({ id: q.id, slug: q.slug, title: q.title, category: q.category }));
}

type AnswerRow = {
  id: string;
  body: string;
  status: string;
  provider: {
    full_name: string;
    role: ProviderRole;
    slug: string;
    claim_status: string;
    image_url: string | null;
  } | null;
  answer_votes: { count: number }[] | null;
};

export async function getQuestionBySlug(
  slug: string,
): Promise<UiQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, slug, title, body, category, created_at, question_votes(count), answers ( id, body, status, provider:providers ( full_name, role, slug, claim_status, image_url ), answer_votes(count) )',
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const answerRows = (data.answers ?? []) as unknown as AnswerRow[];
  const answers: UiAnswer[] = answerRows
    .filter((a) => a.status === 'published' && a.provider)
    .map((a) => ({
      id: a.id,
      body: a.body,
      upvotes: countOf(a.answer_votes),
      providerName: a.provider!.full_name,
      providerRole: a.provider!.role,
      providerSlug: a.provider!.slug,
      providerVerified: a.provider!.claim_status === 'claimed',
      providerImageUrl: a.provider!.image_url,
    }));

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    body: data.body,
    category: data.category,
    createdAt: data.created_at,
    upvotes: countOf(data.question_votes as unknown as { count: number }[]),
    answerCount: answers.length,
    answers,
  };
}
