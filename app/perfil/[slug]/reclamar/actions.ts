'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';

const schema = z.object({
  providerId: z.string().uuid(),
  slug: z.string().min(1),
  whatsapp: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type ClaimState = { error?: string; submitted?: boolean };

export async function submitClaim(
  _prev: ClaimState,
  formData: FormData,
): Promise<ClaimState> {
  const user = await getUser();
  if (!user) {
    return { error: 'Debes iniciar sesión para reclamar un perfil.' };
  }

  const parsed = schema.safeParse({
    providerId: formData.get('providerId'),
    slug: formData.get('slug'),
    whatsapp: formData.get('whatsapp') ?? '',
    message: formData.get('message') ?? '',
  });
  if (!parsed.success) {
    return { error: 'Revisa los datos del formulario e intenta de nuevo.' };
  }
  const { providerId, slug, whatsapp, message } = parsed.data;

  const supabase = await createClient();

  // Reject if this provider is already claimed.
  const { data: provider } = await supabase
    .from('providers')
    .select('id, claim_status')
    .eq('id', providerId)
    .maybeSingle();
  if (!provider) {
    return { error: 'No encontramos este perfil.' };
  }
  if (provider.claim_status === 'claimed') {
    return { error: 'Este perfil ya fue reclamado.' };
  }

  // Avoid duplicate pending claims by the same user.
  const { data: existing, error: existingError } = await supabase
    .from('claims')
    .select('id')
    .eq('provider_id', providerId)
    .eq('claimant_id', user.id)
    .eq('status', 'pending')
    .maybeSingle();
  if (existingError) {
    return { error: 'No pudimos verificar tu solicitud. Intenta de nuevo.' };
  }
  if (existing) {
    return { submitted: true };
  }

  const { error } = await supabase.from('claims').insert({
    provider_id: providerId,
    claimant_id: user.id,
    claimant_email: user.email ?? null,
    claimant_whatsapp: whatsapp ? whatsapp : null,
    message: message ? message : null,
    status: 'pending',
  });

  if (error) {
    return { error: 'No pudimos registrar tu solicitud. Intenta de nuevo.' };
  }

  revalidatePath(`/perfil/${slug}`);
  return { submitted: true };
}
