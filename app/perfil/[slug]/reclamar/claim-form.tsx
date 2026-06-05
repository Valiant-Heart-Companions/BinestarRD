'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { submitClaim, type ClaimState } from './actions';

export default function ClaimForm({
  providerId,
  slug,
  defaultWhatsapp,
}: {
  providerId: string;
  slug: string;
  defaultWhatsapp?: string | null;
}) {
  const [state, formAction, pending] = useActionState<ClaimState, FormData>(
    submitClaim,
    {},
  );

  if (state.submitted) {
    return (
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1C3A33] mb-2">
          Solicitud recibida
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Revisaremos tu solicitud y te contactaremos para verificar tu
          identidad. Mientras tanto, tu perfil aparece como{' '}
          <span className="font-semibold">pendiente de verificación</span>.
        </p>
        <Link href={`/perfil/${slug}`} className="btn-secondary">
          Volver al perfil
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="providerId" value={providerId} />
      <input type="hidden" name="slug" value={slug} />

      <div>
        <label
          htmlFor="whatsapp"
          className="block text-sm font-semibold text-[#1C3A33] mb-1"
        >
          WhatsApp de contacto{' '}
          <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          defaultValue={defaultWhatsapp ?? ''}
          placeholder="809-000-0000"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
        />
        <p className="text-xs text-gray-500 mt-1">
          Lo usamos solo para verificar tu identidad.
        </p>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-[#1C3A33] mb-1"
        >
          Mensaje{' '}
          <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Cuéntanos cómo podemos verificar que este perfil es tuyo (número de exequátur, sitio web, etc.)."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? 'Enviando…' : 'Enviar solicitud de reclamo'}
      </button>

      <p className="text-xs text-center text-gray-500">
        Verificación ligera: revisaremos manualmente antes de darte el control
        del perfil.
      </p>
    </form>
  );
}
