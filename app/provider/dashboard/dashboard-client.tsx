'use client';

import { useActionState, useMemo, useState } from 'react';
import {
    BarChart2,
    MessageSquare,
    Star,
    Settings,
    Save,
    Edit3,
    Stethoscope,
    Send,
    CheckCircle2,
    Circle,
    Camera,
} from 'lucide-react';
import type { UiProvider } from '@/lib/provider-types';
import type { ProviderStats } from '@/lib/providers';
import {
    updateMyProfile,
    answerQuestion,
    updateMyPhoto,
    type SaveState,
    type AnswerState,
    type PhotoState,
} from './actions';
import ProviderAvatar from '@/components/provider-avatar';
import styles from '../provider.module.css';

export type InboxQuestion = {
    id: string;
    slug: string;
    title: string;
    category: string | null;
};

function InboxItem({ question }: { question: InboxQuestion }) {
    const [open, setOpen] = useState(false);
    const [state, formAction, pending] = useActionState<AnswerState, FormData>(
        answerQuestion,
        {},
    );

    if (state.submitted) {
        return (
            <div className={styles.inboxItem}>
                <div className={styles.questionTitle}>{question.title}</div>
                <p className="text-sm text-green-600 mt-1">
                    Respuesta enviada. Se publicará tras revisión.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.inboxItem}>
            <div className={styles.questionTitle}>{question.title}</div>
            <div className={styles.questionMeta}>
                <span>{question.category ?? 'General'}</span>
            </div>
            {open ? (
                <form action={formAction} className="mt-2">
                    <input type="hidden" name="questionId" value={question.id} />
                    <textarea
                        name="body"
                        required
                        rows={3}
                        placeholder="Escribe una respuesta profesional y empática…"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3A33]/30"
                    />
                    {state.error ? (
                        <p className="text-sm text-red-600 mt-1">{state.error}</p>
                    ) : null}
                    <div className={styles.actionRow}>
                        <button type="submit" className={styles.btnAnswer} disabled={pending}>
                            {pending ? 'Enviando…' : 'Enviar respuesta'}
                        </button>
                        <button type="button" className={styles.btnFlag} onClick={() => setOpen(false)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div className={styles.actionRow}>
                    <button className={styles.btnAnswer} onClick={() => setOpen(true)}>
                        Responder
                    </button>
                </div>
            )}
        </div>
    );
}

function PhotoForm({ provider }: { provider: UiProvider }) {
    const [state, formAction, pending] = useActionState<PhotoState, FormData>(
        updateMyPhoto,
        {},
    );
    return (
        <form action={formAction} className={styles.sectionCard} style={{ maxWidth: 640, marginBottom: '1.5rem' }}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}><Camera className="w-5 h-5" /> Foto de perfil</h2>
            </div>
            <div className={styles.cardBody}>
                <div className="flex items-center gap-4">
                    <div style={{ position: 'relative', width: 80, height: 80, borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
                        <ProviderAvatar src={provider.image} name={provider.name} fill sizes="80px" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            type="file"
                            name="photo"
                            accept="image/jpeg,image/png,image/webp"
                            required
                            className={styles.input}
                        />
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG o WebP. Máximo 5 MB.</p>
                    </div>
                </div>
                {state.error ? <p className="text-sm text-red-600 mt-2">{state.error}</p> : null}
                {state.saved ? <p className="text-sm text-green-600 mt-2">Foto actualizada.</p> : null}
                <div className={styles.actionRow}>
                    <button type="submit" className={styles.btnSave} disabled={pending}>
                        <Save className="w-4 h-4 inline mr-2" /> {pending ? 'Subiendo…' : 'Subir foto'}
                    </button>
                </div>
            </div>
        </form>
    );
}

type ChecklistItem = { label: string; done: boolean };

function useChecklist(provider: UiProvider): ChecklistItem[] {
    return useMemo(
        () => [
            { label: 'Biografía profesional', done: provider.bio.trim().length > 0 },
            { label: 'Precio de consulta', done: provider.price != null },
            { label: 'Foto de perfil', done: provider.image.trim().length > 0 },
            { label: 'Datos de contacto', done: Boolean(provider.whatsapp || provider.phone) },
            { label: 'Especialidades', done: provider.specialties.length > 0 },
            { label: 'Seguros aceptados', done: provider.insurance.length > 0 },
        ],
        [provider],
    );
}

export default function DashboardClient({
    provider,
    inbox,
    stats,
}: {
    provider: UiProvider;
    inbox: InboxQuestion[];
    stats: ProviderStats;
}) {
    const [tab, setTab] = useState<'overview' | 'profile' | 'inbox'>('overview');
    const [bio, setBio] = useState(provider.bio);
    const [price, setPrice] = useState<number | ''>(provider.price ?? '');
    const [state, formAction, pending] = useActionState<SaveState, FormData>(
        updateMyProfile,
        {},
    );

    const checklist = useChecklist(provider);
    const completed = checklist.filter((c) => c.done).length;
    const completePct = Math.round((completed / checklist.length) * 100);

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Stethoscope className="w-6 h-6" /> Portal Especialista
                </div>
                <nav className={styles.nav}>
                    <button
                        onClick={() => setTab('overview')}
                        className={tab === 'overview' ? styles.navItemActive : styles.navItem}
                    >
                        <BarChart2 className="w-5 h-5 mr-3" /> Mi impacto
                    </button>
                    <button
                        onClick={() => setTab('inbox')}
                        className={tab === 'inbox' ? styles.navItemActive : styles.navItem}
                    >
                        <MessageSquare className="w-5 h-5 mr-3" /> Consultas
                        {inbox.length > 0 && (
                            <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                {inbox.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab('profile')}
                        className={tab === 'profile' ? styles.navItemActive : styles.navItem}
                    >
                        <Settings className="w-5 h-5 mr-3" /> Mi perfil
                    </button>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.welcomeUser}>Hola, {provider.name}</h1>
                        <p className={styles.subtitle}>
                            {tab === 'overview' && 'Aquí tienes el resumen de tu actividad.'}
                            {tab === 'inbox' && 'Preguntas de la comunidad esperando tu voz experta.'}
                            {tab === 'profile' && 'Mantén tu información al día para atraer más pacientes.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            • Perfil visible
                        </span>
                    </div>
                </header>

                {tab === 'overview' && (
                    <>
                        <section className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                                    <Star className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className={styles.statValue}>
                                        {provider.rating != null && provider.rating > 0
                                            ? provider.rating.toFixed(1)
                                            : '—'}
                                    </div>
                                    <div className={styles.statLabel}>Calificación promedio</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className={styles.statValue}>{provider.reviewCount}</div>
                                    <div className={styles.statLabel}>Reseñas recibidas</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={`${styles.statIcon} ${styles.iconGreen}`}>
                                    <Send className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className={styles.statValue}>{stats.answersPublished}</div>
                                    <div className={styles.statLabel}>
                                        Respuestas publicadas
                                        {stats.answersPending > 0 && (
                                            <span className="text-amber-600">
                                                {' '}· {stats.answersPending} en revisión
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className={styles.sectionCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    <CheckCircle2 className="w-5 h-5" /> Completa tu perfil
                                </h2>
                                <span className={styles.completePct}>{completePct}%</span>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.progressTrack}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${completePct}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-3 mb-4">
                                    {completePct === 100
                                        ? 'Tu perfil está completo. ¡Excelente!'
                                        : 'Los perfiles completos generan más confianza y consultas.'}
                                </p>
                                <ul className={styles.checklist}>
                                    {checklist.map((item) => (
                                        <li key={item.label} className={styles.checkItem}>
                                            {item.done ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                                            )}
                                            <span className={item.done ? styles.checkDone : ''}>
                                                {item.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                {completePct < 100 && (
                                    <button
                                        className={styles.btnSave}
                                        style={{ marginTop: '1.25rem' }}
                                        onClick={() => setTab('profile')}
                                    >
                                        <Edit3 className="w-4 h-4 inline mr-2" /> Editar mi perfil
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {tab === 'profile' && (
                    <>
                    <PhotoForm provider={provider} />
                    <form action={formAction} className={styles.sectionCard} style={{ maxWidth: 640 }}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><Edit3 className="w-5 h-5" /> Editar perfil</h2>
                            <button type="submit" className={styles.btnSave} disabled={pending}>
                                <Save className="w-4 h-4 inline mr-2" /> {pending ? 'Guardando…' : 'Guardar'}
                            </button>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="bio">Biografía profesional</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    className={styles.textarea}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="price">Precio consulta (RD$)</label>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        className={styles.input}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="Ej: 3000"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Teléfono de contacto</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={provider.phone ?? ''}
                                        disabled
                                        title="Contacta soporte para cambiar esto"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>WhatsApp (si aplica)</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={provider.whatsapp ?? ''}
                                        disabled
                                        title="Contacta soporte para cambiar esto"
                                    />
                                </div>
                            </div>
                            {state.error ? (
                                <p className="text-sm text-red-600 mt-2">{state.error}</p>
                            ) : null}
                            {state.saved ? (
                                <p className="text-sm text-green-600 mt-2">Cambios guardados.</p>
                            ) : null}
                        </div>
                    </form>
                    </>
                )}

                {tab === 'inbox' && (
                    <div className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <MessageSquare className="w-5 h-5" /> Preguntas para ti
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full ml-2">
                                    {inbox.length}
                                </span>
                            </h2>
                        </div>
                        <div className={styles.inboxList}>
                            {inbox.length === 0 ? (
                                <p className="text-sm text-gray-500 p-4">
                                    No hay preguntas pendientes por responder ahora mismo.
                                </p>
                            ) : (
                                inbox.map((q) => (
                                    <InboxItem key={q.id} question={q} />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
