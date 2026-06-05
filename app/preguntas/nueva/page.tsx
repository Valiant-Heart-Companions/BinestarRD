import Link from 'next/link';
import AskForm from './ask-form';

export const metadata = {
  title: 'Hacer una pregunta',
  description:
    'Haz tu pregunta de salud mental de forma anónima y recibe respuestas de especialistas verificados en República Dominicana.',
};

export default function NuevaPreguntaPage() {
  return (
    <div className="container" style={{ maxWidth: 640, padding: '3rem 1.5rem' }}>
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/preguntas" className="hover:underline">
          ← Volver a la comunidad
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
          }}
        >
          Hacer una pregunta
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          Pregunta de forma anónima. Especialistas verificados pueden responder
          para ayudarte a ti y a otras personas con dudas similares.
        </p>

        <AskForm />
      </div>
    </div>
  );
}
