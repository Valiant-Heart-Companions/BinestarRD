'use client';

import { useActionState } from 'react';
import { signIn, type SignInState } from '@/app/auth/actions';
import { Mail, CheckCircle } from 'lucide-react';

export default function LoginForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signIn,
    { error: initialError },
  );

  if (state.sent) {
    return (
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1C3A33] mb-2">
          Revisa tu correo
        </h2>
        <p className="text-gray-600 text-sm">
          Enviamos un enlace de acceso a{' '}
          <span className="font-semibold">{state.email}</span>. Ábrelo en este
          dispositivo para entrar.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[#1C3A33] mb-1"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email}
            placeholder="tu@correo.com"
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
          />
        </div>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? 'Enviando…' : 'Enviar enlace de acceso'}
      </button>

      <p className="text-xs text-center text-gray-500">
        Te enviaremos un enlace seguro. No necesitas contraseña.
      </p>
    </form>
  );
}
