import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const COOKIE = 'bienestar_vid';

// Read-only voter key for Server Components: authenticated user id, or an
// existing anonymous cookie. Returns null if neither exists yet (the visitor
// simply hasn't voted).
export async function getVoterKey(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return `user:${user.id}`;
  const store = await cookies();
  const vid = store.get(COOKIE)?.value;
  return vid ? `anon:${vid}` : null;
}

// Voter key for Server Actions: same as above but sets the anonymous cookie
// when missing so repeated anonymous votes dedupe.
export async function ensureVoterKey(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return `user:${user.id}`;
  const store = await cookies();
  let vid = store.get(COOKIE)?.value;
  if (!vid) {
    vid = crypto.randomUUID();
    store.set(COOKIE, vid, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return `anon:${vid}`;
}
