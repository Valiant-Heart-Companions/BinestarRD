import { createClient } from '@/lib/supabase/server';

export interface UiReview {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  authorName: string;
}

export async function getPublishedReviews(
  providerId: string,
): Promise<UiReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, body, created_at, author:profiles ( display_name )')
    .eq('provider_id', providerId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;

  type Row = {
    id: string;
    rating: number;
    body: string | null;
    created_at: string;
    author: { display_name: string | null } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    createdAt: r.created_at,
    authorName: r.author?.display_name?.trim() || 'Paciente',
  }));
}

export type MyReviewStatus = 'none' | 'pending' | 'published' | 'flagged' | 'removed';

// Returns the current user's review status for a provider, or 'none'.
// 'self' means the logged-in user owns this provider (cannot review themselves).
export async function getMyReviewState(
  providerId: string,
  providerOwnerId: string | null,
): Promise<{ status: MyReviewStatus; isSelf: boolean; isAuthed: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: 'none', isSelf: false, isAuthed: false };
  if (providerOwnerId && providerOwnerId === user.id) {
    return { status: 'none', isSelf: true, isAuthed: true };
  }
  const { data } = await supabase
    .from('reviews')
    .select('status')
    .eq('provider_id', providerId)
    .eq('author_id', user.id)
    .maybeSingle();
  return {
    status: (data?.status as MyReviewStatus) ?? 'none',
    isSelf: false,
    isAuthed: true,
  };
}
