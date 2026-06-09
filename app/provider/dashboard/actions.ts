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

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type PhotoState = { error?: string; saved?: boolean };

export async function updateMyPhoto(
  _prev: PhotoState,
  formData: FormData,
): Promise<PhotoState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Tu sesión expiró. Vuelve a iniciar sesión.' };
  }

  const file = formData.get('photo');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Selecciona una imagen.' };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { error: 'Formato no válido. Usa JPG, PNG o WebP.' };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { error: 'La imagen es muy grande (máximo 5 MB).' };
  }

  const { data: provider } = await supabase
    .from('providers')
    .select('id, slug')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!provider) {
    return { error: 'No encontramos un perfil asociado a tu cuenta.' };
  }

  // Folder keyed by auth.uid() so storage RLS can scope writes to the owner.
  const path = `${user.id}/avatar`;
  const { error: uploadError } = await supabase.storage
    .from('provider-avatars')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) {
    return { error: 'No pudimos subir la imagen. Intenta de nuevo.' };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('provider-avatars').getPublicUrl(path);
  // Cache-bust so the new photo shows immediately on a stable path.
  const imageUrl = `${publicUrl}?v=${Date.now()}`;

  const { error } = await supabase
    .from('providers')
    .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('id', provider.id);
  if (error) {
    return { error: 'No pudimos guardar la imagen. Intenta de nuevo.' };
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
