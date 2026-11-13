// Canonical public origin for the site, used for metadata, sitemap, robots,
// and structured data. Falls back to localhost for local dev.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = 'Bienestar RD';

export const SITE_DESCRIPTION =
  'Directorio de psicólogos y psiquiatras verificados en República Dominicana. Precios transparentes, sin intermediarios: contacta directamente con el especialista.';
