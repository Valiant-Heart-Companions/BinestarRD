import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';
import { getQuestionBySlug, getVotedQuestionIds, getVotedAnswerIds } from '@/lib/questions';
import { upvoteQuestionAction, upvoteAnswerAction } from '../vote-actions';
import { roleLabel } from '@/lib/providers';
import styles from '../qa.module.css';

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const question = await getQuestionBySlug(slug);
    if (!question) return {};
    const description = question.body.substring(0, 150) + '...';
    return {
        title: question.title,
        description,
        alternates: { canonical: `/preguntas/${question.slug}` },
        openGraph: {
            type: 'article',
            title: question.title,
            description,
            url: `/preguntas/${question.slug}`,
        },
    };
}

export default async function QuestionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const question = await getQuestionBySlug(slug);

    if (!question) return notFound();

    const [votedQuestions, votedAnswers] = await Promise.all([
        getVotedQuestionIds(),
        getVotedAnswerIds(),
    ]);
    const questionVoted = votedQuestions.has(question.id);

    return (
        <div className={styles.qaContainer}>
            <div className="mb-6">
                <Link href="/preguntas" className="text-sm text-gray-500 hover:underline">← Volver a Preguntas</Link>
            </div>

            <article>
                <div className={styles.detailHeader}>
                    {question.category && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            {question.category}
                        </span>
                    )}
                    <h1 className={styles.detailTitle}>{question.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span>Publicado el {formatDate(question.createdAt)}</span>
                        {question.upvotes > 0 && (
                            <>
                                <span>•</span>
                                <span>{question.upvotes} personas tienen esta duda</span>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.detailBody}>
                    {question.body}
                </div>

                <form action={upvoteQuestionAction} className="mb-8">
                    <input type="hidden" name="id" value={question.id} />
                    <input type="hidden" name="slug" value={question.slug} />
                    <button
                        type="submit"
                        disabled={questionVoted}
                        className={`${styles.voteButton} ${questionVoted ? styles.voted : ''}`}
                        style={{ cursor: questionVoted ? 'default' : 'pointer', border: 'none', marginLeft: 0 }}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        {questionVoted ? 'Tienes esta duda' : 'También tengo esta duda'} ({question.upvotes})
                    </button>
                </form>

                <section className={styles.answersSection}>
                    <h2 className={styles.answersTitle}>
                        <MessageSquare className="w-6 h-6 text-[#1C3A33]" />
                        {question.answers.length} Respuestas de Especialistas
                    </h2>

                    {question.answers.length === 0 && (
                        <p className="text-gray-500 py-6">
                            Todavía no hay respuestas de especialistas para esta pregunta.
                        </p>
                    )}

                    {question.answers.map(answer => (
                        <div key={answer.id} className={styles.answerCard}>
                            <div className={styles.providerInfo}>
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {answer.providerName.charAt(0)}
                                </div>
                                <div>
                                    <div className={styles.providerName}>
                                        <Link href={`/perfil/${answer.providerSlug}`} className="hover:underline">
                                            {answer.providerName}
                                        </Link>
                                        {answer.providerVerified && (
                                            <CheckCircle className="w-3 h-3 text-blue-500 inline ml-1" />
                                        )}
                                    </div>
                                    <div className={styles.providerRole}>{roleLabel(answer.providerRole)}</div>
                                </div>
                            </div>

                            <div className={styles.answerContent}>
                                {answer.body}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-100 flex items-center">
                                <div className="text-xs text-gray-400">Respuesta de especialista</div>
                                <form action={upvoteAnswerAction} style={{ marginLeft: 'auto' }}>
                                    <input type="hidden" name="id" value={answer.id} />
                                    <input type="hidden" name="slug" value={question.slug} />
                                    <button
                                        type="submit"
                                        disabled={votedAnswers.has(answer.id)}
                                        className={`${styles.voteButton} ${votedAnswers.has(answer.id) ? styles.voted : ''}`}
                                        style={{ cursor: votedAnswers.has(answer.id) ? 'default' : 'pointer', border: 'none' }}
                                    >
                                        <ThumbsUp className="w-4 h-4" /> Útil ({answer.upvotes})
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </section>
            </article>
        </div>
    );
}
