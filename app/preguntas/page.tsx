import Link from 'next/link';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { getPublishedQuestions, getVotedQuestionIds } from '@/lib/questions';
import { upvoteQuestionAction } from './vote-actions';
import styles from './qa.module.css';

export const metadata = {
    title: 'Preguntas y Respuestas sobre Salud Mental',
    description: 'Encuentra respuestas a tus dudas sobre ansiedad, depresión, terapia y más, respondidas por especialistas verificados.',
};

export default async function QPIndexPage() {
    const [publishedQuestions, votedIds] = await Promise.all([
        getPublishedQuestions(),
        getVotedQuestionIds(),
    ]);

    return (
        <div className={styles.qaContainer}>
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>Comunidad de Bienestar</h1>
                <p className={styles.heroSubtitle}>
                    Un espacio seguro donde especialistas verificados responden tus dudas sobre salud mental de forma gratuita.
                </p>
                <Link href="/preguntas/nueva" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                    Hacer una pregunta
                </Link>
            </header>

            {publishedQuestions.length > 0 ? (
                <div className={styles.questionGrid}>
                    {publishedQuestions.map(q => (
                        <article key={q.id} className={styles.questionCard}>
                            <Link href={`/preguntas/${q.slug}`} className={styles.titleLink}>
                                <div className={styles.cardHeader}>
                                    {q.category && <span className={styles.category}>{q.category}</span>}
                                    <span className={styles.meta}>{q.answerCount} respuestas</span>
                                </div>
                                <h2 className={styles.title}>{q.title}</h2>
                                <p className={styles.preview}>{q.body}</p>
                            </Link>

                            <div className={styles.cardFooter}>
                                <form action={upvoteQuestionAction}>
                                    <input type="hidden" name="id" value={q.id} />
                                    <input type="hidden" name="slug" value={q.slug} />
                                    <button
                                        type="submit"
                                        disabled={votedIds.has(q.id)}
                                        className={styles.stat}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: votedIds.has(q.id) ? 'default' : 'pointer',
                                            color: votedIds.has(q.id) ? 'var(--color-primary)' : undefined,
                                        }}
                                        title={votedIds.has(q.id) ? 'Ya marcaste esta pregunta' : 'También tengo esta duda'}
                                    >
                                        <ThumbsUp className="w-4 h-4" /> {q.upvotes}
                                    </button>
                                </form>
                                <Link href={`/preguntas/${q.slug}`} className={styles.stat}>
                                    <MessageCircle className="w-4 h-4" /> Ver respuestas
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 max-w-xl mx-auto">
                    <p className="text-lg font-medium text-gray-700">Aún no hay preguntas publicadas</p>
                    <p className="mt-2">
                        Esta comunidad está comenzando. Pronto los especialistas verificados
                        responderán dudas sobre salud mental aquí.
                    </p>
                </div>
            )}
        </div>
    );
}
