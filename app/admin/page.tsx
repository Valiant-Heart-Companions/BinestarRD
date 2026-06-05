import { redirect } from 'next/navigation';
import { getUser, getProfile } from '@/lib/auth';
import {
  getAdminStats,
  getListingsNeedingAttention,
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

  const [stats, listings, claims, questions, answers, reviews] =
    await Promise.all([
      getAdminStats(),
      getListingsNeedingAttention(),
      getPendingClaims(),
      getModerationQuestions(),
      getModerationAnswers(),
      getModerationReviews(),
    ]);

  return (
    <AdminClient
      stats={stats}
      listings={listings}
      claims={claims}
      questions={questions}
      answers={answers}
      reviews={reviews}
    />
  );
}
