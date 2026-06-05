'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';

const idSchema = z.string().uuid();
const contentStatus = z.enum(['published', 'flagged', 'removed']);

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error('not authorized');
  }
}

export async function approveClaimAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get('id'));
  const supabase = await createClient();
  const { error } = await supabase.rpc('approve_claim', { p_claim_id: id });
  if (error) throw error;
  revalidatePath('/admin');
}

export async function rejectClaimAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get('id'));
  const supabase = await createClient();
  const { error } = await supabase.rpc('reject_claim', { p_claim_id: id });
  if (error) throw error;
  revalidatePath('/admin');
}

export async function moderateQuestionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get('id'));
  const status = contentStatus.parse(formData.get('status'));
  const supabase = await createClient();
  const { error } = await supabase
    .from('questions')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/preguntas');
}

export async function moderateAnswerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get('id'));
  const status = contentStatus.parse(formData.get('status'));
  const supabase = await createClient();
  const { error } = await supabase
    .from('answers')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin');
  revalidatePath('/preguntas');
}

export async function moderateReviewAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = idSchema.parse(formData.get('id'));
  const status = contentStatus.parse(formData.get('status'));
  const supabase = await createClient();
  const { error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin');
}
