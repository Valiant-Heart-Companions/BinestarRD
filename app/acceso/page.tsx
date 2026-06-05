import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import LoginForm from './login-form';

export const metadata = {
  title: 'Acceso para especialistas',
  description:
    'Inicia sesión para reclamar tu perfil, responder preguntas y gestionar tu información en Bienestar RD.',
};

export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  const user = await getUser();
  if (user) {
    redirect(next && next.startsWith('/') ? next : '/provider/dashboard');
  }

  return (
    <div className="container" style={{ maxWidth: 440, padding: '4rem 1.5rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div className="text-center mb-6">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            Acceso para especialistas
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Reclama tu perfil y gestiona tu presencia en Bienestar RD.
          </p>
        </div>

        <LoginForm next={next} initialError={error} />
      </div>
    </div>
  );
}
