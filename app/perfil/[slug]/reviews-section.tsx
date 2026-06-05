'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { submitReview, type ReviewState } from './review-actions';
import type { UiReview } from '@/lib/reviews';
import type { MyReviewStatus } from '@/lib/reviews';

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= value ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </span>
  );
}

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
  });
}

function ReviewForm({
  providerId,
  slug,
}: {
  providerId: string;
  slug: string;
}) {
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(
    submitReview,
    {},
  );
  const [rating, setRating] = useState(0);

  if (state.sent) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
        <p className="font-semibold">¡Gracias por tu reseña!</p>
        <p className="mt-1">
          La revisaremos antes de publicarla para mantener la calidad del
          directorio.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-gray-200 bg-white p-4 space-y-4"
    >
      <input type="hidden" name="providerId" value={providerId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tu calificación
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
              className="p-0.5"
            >
              <Star
                className={`w-7 h-7 transition-colors ${n <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-body"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Comentario <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          id="review-body"
          name="body"
          rows={4}
          maxLength={2000}
          placeholder="Comparte tu experiencia para ayudar a otros pacientes."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1C3A33] focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Enviando…' : 'Enviar reseña'}
      </button>
      <p className="text-xs text-gray-500">
        Tu reseña pasará por moderación antes de publicarse.
      </p>
    </form>
  );
}

export default function ReviewsSection({
  providerId,
  slug,
  reviews,
  myStatus,
  isSelf,
  isAuthed,
}: {
  providerId: string;
  slug: string;
  reviews: UiReview[];
  myStatus: MyReviewStatus;
  isSelf: boolean;
  isAuthed: boolean;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#1C3A33] mb-4">
        <Star className="w-5 h-5" /> Reseñas de pacientes
      </h2>

      <div className="mb-6">
        {!isAuthed ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <Link
              href={`/acceso?next=/perfil/${slug}`}
              className="font-semibold underline"
            >
              Inicia sesión
            </Link>{' '}
            para dejar una reseña verificada.
          </div>
        ) : isSelf ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Este es tu perfil. No puedes reseñarte a ti mismo.
          </div>
        ) : myStatus === 'pending' ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            Tu reseña está en revisión. La publicaremos pronto.
          </div>
        ) : myStatus === 'published' ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            Ya publicaste una reseña para este especialista. ¡Gracias!
          </div>
        ) : myStatus === 'flagged' || myStatus === 'removed' ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Tu reseña fue retirada por moderación.
          </div>
        ) : (
          <ReviewForm providerId={providerId} slug={slug} />
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">
          Aún no hay reseñas publicadas. Sé el primero en compartir tu
          experiencia.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {r.authorName}
                </span>
                <Stars value={r.rating} />
              </div>
              {r.body && (
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                  {r.body}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-400">
                {dateLabel(r.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
