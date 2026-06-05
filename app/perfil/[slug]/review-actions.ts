'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type ReviewState = { error?: string; sent?: boolean };

const schema = z.object({
  providerId: z.string().uuid(),
  slug: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  body: z
    .string()
    .trim()
    .max(2000, 'El comentario es demasiado largo.')
    .optional()
    .transform((v) => (v ? v : null)),
});

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const parsed = schema.safeParse({
    providerId: formData.get('providerId'),
    slug: formData.get('slug'),
    rating: formData.get('rating'),
    body: formData.get('body'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }
  const { providerId, slug, rating, body } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Debes iniciar sesión para dejar una reseña.' };
  }

  // Block self-reviews by the provider owner.
  const { data: provider } = await supabase
    .from('providers')
    .select('owner_id')
    .eq('id', providerId)
    .maybeSingle();
  if (provider?.owner_id === user.id) {
    return { error: 'No puedes reseñar tu propio perfil.' };
  }

  const { error } = await supabase.from('reviews').insert({
    provider_id: providerId,
    author_id: user.id,
    rating,
    body,
    status: 'pending',
  });
  if (error) {
    if (error.code === '23505') {
      return { error: 'Ya enviaste una reseña para este especialista.' };
    }
    return { error: 'No pudimos guardar tu reseña. Intenta de nuevo.' };
  }

  revalidatePath(`/perfil/${slug}`);
  return { sent: true };
}
