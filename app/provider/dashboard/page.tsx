import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { getMyProvider, getProviderStats } from '@/lib/providers';
import { getInboxForProvider } from '@/lib/questions';
import { getSpecialtyOptions, getInsuranceOptions } from '@/lib/taxonomy';
import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Portal del especialista',
  robots: { index: false },
};

export default async function ProviderDashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/acceso?next=/provider/dashboard');
  }

  const provider = await getMyProvider();

  if (!provider) {
    return (
      <div className="container" style={{ maxWidth: 560, padding: '4rem 1.5rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            Aún no controlas ningún perfil
          </h1>
          <p className="text-sm text-gray-600 mt-3 mb-6">
            Para gestionar tu información, primero reclama tu perfil en el
            directorio. Si tu solicitud está en revisión, te avisaremos cuando
            sea aprobada.
          </p>
          <Link href="/busqueda" className="btn-primary">
            Buscar mi perfil en el directorio
          </Link>
        </div>
      </div>
    );
  }

  const [inbox, stats, specialtyOptions, insuranceOptions] = await Promise.all([
    getInboxForProvider(provider.id),
    getProviderStats(provider.id),
    getSpecialtyOptions(),
    getInsuranceOptions(),
  ]);

  return (
    <DashboardClient
      provider={provider}
      inbox={inbox}
      stats={stats}
      specialtyOptions={specialtyOptions}
      insuranceOptions={insuranceOptions}
    />
  );
}
