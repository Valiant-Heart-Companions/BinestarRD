import { redirect } from 'next/navigation';
import { getUser, getProfile } from '@/lib/auth';
import {
  getPendingClaims,
  getModerationQuestions,
  getModerationAnswers,
  getModerationReviews,
} from '@/lib/admin';
import AdminClient from './admin-client';

export const metadata = {
  title: 'Administración',
  robots: { index: false },
};

export default async function AdminPage() {
  const user = await getUser();
  if (!user) {
    redirect('/acceso?next=/admin');
  }

  const profile = await getProfile();
  if (profile?.role !== 'admin') {
    redirect('/');
  }

  const [claims, questions, answers, reviews] = await Promise.all([
    getPendingClaims(),
    getModerationQuestions(),
    getModerationAnswers(),
    getModerationReviews(),
  ]);

  return (
    <AdminClient
      claims={claims}
      questions={questions}
      answers={answers}
      reviews={reviews}
    />
  );
}
