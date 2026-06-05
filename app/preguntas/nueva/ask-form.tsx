'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { submitQuestion, type AskState } from './actions';
import { ASK_CATEGORIES } from './categories';

export default function AskForm() {
  const [state, formAction, pending] = useActionState<AskState, FormData>(
    submitQuestion,
    {},
  );

  if (state.submitted) {
    return (
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1C3A33] mb-2">
          Pregunta enviada
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Gracias por confiar en la comunidad. Revisaremos tu pregunta antes de
          publicarla para mantener un espacio seguro. Aparecerá pronto para que
          los especialistas la respondan.
        </p>
        <Link href="/preguntas" className="btn-secondary">
          Volver a la comunidad
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-[#1C3A33] mb-1">
          Tu pregunta
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={160}
          placeholder="Ej: ¿Cómo sé si necesito ver a un psicólogo o a un psiquiatra?"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-[#1C3A33] mb-1">
          Más detalles
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={5}
          maxLength={2000}
          placeholder="Describe tu situación con el detalle que te sientas cómodo compartiendo. No incluyas datos que te identifiquen."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-[#1C3A33] mb-1">
          Categoría <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <select
          id="category"
          name="category"
          defaultValue=""
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
        >
          <option value="">Selecciona una categoría</option>
          {ASK_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? 'Enviando…' : 'Enviar pregunta'}
      </button>

      <p className="text-xs text-center text-gray-500">
        Tu pregunta es anónima. Revisamos cada envío antes de publicarlo. Esto
        no sustituye atención profesional ni es una urgencia médica.
      </p>
    </form>
  );
}
