'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const emailSchema = z.string().email();

export type SignInState = { error?: string; sent?: boolean; email?: string };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const raw = String(formData.get('email') ?? '').trim().toLowerCase();
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: 'Ingresa un correo electrónico válido.', email: raw };
  }
  const email = parsed.data;
  const next = String(formData.get('next') ?? '').trim();

  const hdrs = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    hdrs.get('origin') ??
    `https://${hdrs.get('host')}`;

  const callback = new URL('/auth/callback', origin);
  if (next && next.startsWith('/')) callback.searchParams.set('next', next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callback.toString() },
  });

  if (error) {
    return { error: 'No pudimos enviar el enlace. Intenta de nuevo.', email };
  }
  return { sent: true, email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
