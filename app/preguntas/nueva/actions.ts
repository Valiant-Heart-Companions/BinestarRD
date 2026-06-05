'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { slugify, randomSuffix } from '@/lib/slug';
import { ASK_CATEGORIES } from './categories';

const schema = z.object({
  title: z.string().trim().min(10, 'Escribe una pregunta más descriptiva.').max(160),
  body: z.string().trim().min(20, 'Cuéntanos un poco más de contexto.').max(2000),
  category: z.enum(ASK_CATEGORIES).optional(),
});

export type AskState = { error?: string; submitted?: boolean };

export async function submitQuestion(
  _prev: AskState,
  formData: FormData,
): Promise<AskState> {
  const categoryRaw = String(formData.get('category') ?? '').trim();
  const parsed = schema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    category: categoryRaw === '' ? undefined : categoryRaw,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisa el formulario.' };
  }
  const { title, body, category } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const slug = `${slugify(title) || 'pregunta'}-${randomSuffix()}`;

  const { error } = await supabase.from('questions').insert({
    title,
    body,
    category: category ?? null,
    slug,
    author_id: user?.id ?? null,
    status: 'pending',
  });

  if (error) {
    return { error: 'No pudimos enviar tu pregunta. Intenta de nuevo.' };
  }
  return { submitted: true };
}
