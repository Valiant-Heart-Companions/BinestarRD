// Client-safe slug helpers (no server imports).

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function randomSuffix(len = 6): string {
  return Math.random().toString(36).slice(2, 2 + len);
}
