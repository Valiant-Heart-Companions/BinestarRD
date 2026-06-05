import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/busqueda`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/preguntas`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/preguntas/nueva`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/legal/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const supabase = await createClient();

  const { data: providers } = await supabase
    .from('providers')
    .select('slug, updated_at')
    .eq('listing_status', 'active');

  const { data: questions } = await supabase
    .from('questions')
    .select('slug, created_at')
    .eq('status', 'published');

  const providerRoutes: MetadataRoute.Sitemap = (providers ?? []).map((p) => ({
    url: `${SITE_URL}/perfil/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const questionRoutes: MetadataRoute.Sitemap = (questions ?? []).map((q) => ({
    url: `${SITE_URL}/preguntas/${q.slug}`,
    lastModified: q.created_at ? new Date(q.created_at) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...providerRoutes, ...questionRoutes];
}
