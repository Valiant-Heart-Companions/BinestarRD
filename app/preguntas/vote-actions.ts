'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ensureVoterKey } from '@/lib/voter';

const uuid = z.string().uuid();

export async function upvoteQuestionAction(formData: FormData): Promise<void> {
  const id = uuid.parse(formData.get('id'));
  const slug = formData.get('slug');
  const voterKey = await ensureVoterKey();
  const supabase = await createClient();
  // PK (question_id, voter_key) makes repeat votes a no-op.
  await supabase
    .from('question_votes')
    .upsert({ question_id: id, voter_key: voterKey }, { onConflict: 'question_id,voter_key', ignoreDuplicates: true });
  revalidatePath('/preguntas');
  if (typeof slug === 'string' && slug) revalidatePath(`/preguntas/${slug}`);
}

export async function upvoteAnswerAction(formData: FormData): Promise<void> {
  const id = uuid.parse(formData.get('id'));
  const slug = formData.get('slug');
  const voterKey = await ensureVoterKey();
  const supabase = await createClient();
  await supabase
    .from('answer_votes')
    .upsert({ answer_id: id, voter_key: voterKey }, { onConflict: 'answer_id,voter_key', ignoreDuplicates: true });
  if (typeof slug === 'string' && slug) revalidatePath(`/preguntas/${slug}`);
}
