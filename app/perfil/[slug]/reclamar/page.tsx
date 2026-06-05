import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getProviderBySlug, roleLabel } from '@/lib/providers';
import { getUser } from '@/lib/auth';
import ClaimForm from './claim-form';

export const metadata = {
  title: 'Reclamar perfil',
  robots: { index: false },
};

export default async function ReclamarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const user = await getUser();
  if (!user) {
    redirect(`/acceso?next=${encodeURIComponent(`/perfil/${slug}/reclamar`)}`);
  }

  return (
    <div className="container" style={{ maxWidth: 520, padding: '3rem 1.5rem' }}>
      <div className="text-sm text-gray-500 mb-6">
        <Link href={`/perfil/${slug}`} className="hover:underline">
          ← Volver al perfil
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
          }}
        >
          Reclamar este perfil
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          Estás solicitando el control de{' '}
          <span className="font-semibold">{provider.name}</span> —{' '}
          {roleLabel(provider.role)}. Una vez verificada tu identidad, podrás
          editar tu información y responder preguntas de pacientes.
        </p>

        {provider.claimStatus === 'claimed' ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">
            Este perfil ya fue reclamado. Si crees que es un error,{' '}
            <Link href="/legal/privacidad" className="font-semibold underline">
              contáctanos
            </Link>
            .
          </p>
        ) : (
          <ClaimForm
            providerId={provider.id}
            slug={slug}
            defaultWhatsapp={provider.whatsapp}
          />
        )}
      </div>
    </div>
  );
}
