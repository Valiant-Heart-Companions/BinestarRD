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

const onlyDigits = (n: string) => n.replace(/\D/g, '');

// DR numbers are 10 local digits (area code 809/829/849 + 7). Prefix the +1
// country code for tel:/wa.me links; pass through anything already prefixed.
function withCountryCode(digits: string): string {
  return digits.length === 10 ? `1${digits}` : digits;
}

export function formatPhone(raw: string): string {
  const d = onlyDigits(raw).replace(/^1(?=\d{10}$)/, '');
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return raw;
}

export interface ProviderContactLinks {
  phoneUrl: string | null;
  phoneDisplay: string | null;
  whatsappUrl: string | null;
}

// We only surface a WhatsApp link when a number is *known* to be on WhatsApp
// (the explicit `whatsapp` field). DR landlines and mobiles share the same area
// codes, so a phone number alone can't be assumed to reach WhatsApp — many
// seeded providers list only a landline.
export function providerContactLinks(
  provider: Pick<UiProvider, 'phone' | 'whatsapp'>,
  whatsappMessage?: string,
): ProviderContactLinks {
  const phone = provider.phone ? onlyDigits(provider.phone) : '';
  const whatsapp = provider.whatsapp ? onlyDigits(provider.whatsapp) : '';
  const text = whatsappMessage
    ? `?text=${encodeURIComponent(whatsappMessage)}`
    : '';
  return {
    phoneUrl: phone ? `tel:+${withCountryCode(phone)}` : null,
    phoneDisplay: provider.phone ? formatPhone(provider.phone) : null,
    whatsappUrl: whatsapp
      ? `https://wa.me/${withCountryCode(whatsapp)}${text}`
      : null,
  };
}
