'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  bio: z.string().trim().max(3000).optional().or(z.literal('')),
  price: z
    .union([z.literal(''), z.coerce.number().int().min(0).max(1000000)])
    .optional(),
});

export type SaveState = { error?: string; saved?: boolean };

export async function updateMyProfile(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Tu sesión expiró. Vuelve a iniciar sesión.' };
  }

  const parsed = schema.safeParse({
    bio: formData.get('bio') ?? '',
    price: formData.get('price') ?? '',
  });
  if (!parsed.success) {
    return { error: 'Revisa los datos: el precio debe ser un número válido.' };
  }
  const { bio, price } = parsed.data;

  const { data: provider } = await supabase
    .from('providers')
    .select('id, slug')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!provider) {
    return { error: 'No encontramos un perfil asociado a tu cuenta.' };
  }

  const { error } = await supabase
    .from('providers')
    .update({
      bio: bio ? bio : null,
      price: price === '' || price === undefined ? null : price,
      updated_at: new Date().toISOString(),
    })
    .eq('id', provider.id);

  if (error) {
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }

  revalidatePath('/provider/dashboard');
  revalidatePath(`/perfil/${provider.slug}`);
  return { saved: true };
}

const answerSchema = z.object({
  questionId: z.string().uuid(),
  body: z.string().trim().min(10, 'La respuesta es muy corta.').max(4000),
});

export type AnswerState = { error?: string; submitted?: boolean };

export async function answerQuestion(
  _prev: AnswerState,
  formData: FormData,
): Promise<AnswerState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Tu sesión expiró. Vuelve a iniciar sesión.' };
  }

  const parsed = answerSchema.safeParse({
    questionId: formData.get('questionId'),
    body: formData.get('body'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisa tu respuesta.' };
  }
  const { questionId, body } = parsed.data;

  const { data: provider } = await supabase
    .from('providers')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!provider) {
    return { error: 'Solo los especialistas con perfil pueden responder.' };
  }

  const { error } = await supabase.from('answers').insert({
    question_id: questionId,
    provider_id: provider.id,
    body,
    status: 'pending',
  });

  if (error) {
    return { error: 'No pudimos enviar la respuesta. Intenta de nuevo.' };
  }

  revalidatePath('/provider/dashboard');
  return { submitted: true };
}
