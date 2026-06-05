// Client-safe provider types and helpers (no server-only imports).

export type ProviderRole = 'psychologist' | 'psychiatrist';
export type ClaimStatus = 'unclaimed' | 'pending' | 'claimed';

export interface UiProvider {
  id: string;
  slug: string;
  name: string;
  role: ProviderRole;
  specialties: string[];
  insurance: string[];
  location: string;
  neighborhood: string | null;
  coordinates: [number, number] | null;
  price: number | null;
  isVerified: boolean;
  isFoundingMember: boolean;
  rating: number | null;
  reviewCount: number;
  image: string;
  bio: string;
  whatsapp: string | null;
  phone: string | null;
  claimStatus: ClaimStatus;
  source: string | null;
  ownerId: string | null;
}

export function roleLabel(role: ProviderRole, clinical = false): string {
  if (role === 'psychiatrist') return 'Psiquiatra';
  return clinical ? 'Psicólogo Clínico' : 'Psicólogo';
}
