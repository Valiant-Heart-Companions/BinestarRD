import { createClient } from '@/lib/supabase/server';

export interface TaxonomyOption {
  id: string;
  name: string;
}

// The lookup tables carry some case-duplicate rows (e.g. "Terapia de pareja"
// vs "Terapia de Pareja") seeded from messy public sources. Collapse them by
// case-insensitive name so the editor shows one clean option per concept;
// selection state elsewhere is matched by name, so the canonical id wins.
function dedupeByName(rows: TaxonomyOption[]): TaxonomyOption[] {
  const seen = new Map<string, TaxonomyOption>();
  for (const row of rows) {
    const key = row.name.trim().toLowerCase();
    if (!seen.has(key)) seen.set(key, { id: row.id, name: row.name.trim() });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export async function getSpecialtyOptions(): Promise<TaxonomyOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('specialties').select('id, name');
  if (error) throw error;
  return dedupeByName(data ?? []);
}

export async function getInsuranceOptions(): Promise<TaxonomyOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('insurances').select('id, name');
  if (error) throw error;
  return dedupeByName(data ?? []);
}
