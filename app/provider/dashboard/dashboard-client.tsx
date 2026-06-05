'use client';

import { useActionState, useState } from 'react';
import {
    BarChart2,
    MessageSquare,
    Users,
    Settings,
    Save,
    Edit3,
    Stethoscope
} from 'lucide-react';
import type { UiProvider } from '@/lib/provider-types';
import { updateMyProfile, answerQuestion, type SaveState, type AnswerState } from './actions';
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

export default function DashboardClient({
    provider,
    inbox,
}: {
    provider: UiProvider;
    inbox: InboxQuestion[];
}) {
    const [bio, setBio] = useState(provider.bio);
    const [price, setPrice] = useState<number | ''>(provider.price ?? '');
    const [state, formAction, pending] = useActionState<SaveState, FormData>(
        updateMyProfile,
        {},
    );

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Stethoscope className="w-6 h-6" /> Portal Especialista
                </div>
                <nav className={styles.nav}>
                    <a href="#" className={styles.navItemActive}>
                        <BarChart2 className="w-5 h-5 mr-3" /> Mi Impacto
                    </a>
                    <a href="#" className={styles.navItem}>
                        <MessageSquare className="w-5 h-5 mr-3" /> Consultas
                    </a>
                    <a href="#" className={styles.navItem}>
                        <Settings className="w-5 h-5 mr-3" /> Configuración
                    </a>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.welcomeUser}>Hola, {provider.name}</h1>
                        <p className={styles.subtitle}>Aquí tienes el resumen de tu actividad.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            • Perfil Visible
                        </span>
                    </div>
                </header>

                <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className={styles.statValue}>—</div>
                            <div className={styles.statLabel}>Visitas al Perfil</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.iconGreen}`}>
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <div className={styles.statValue}>—</div>
                            <div className={styles.statLabel}>Mensajes de WhatsApp</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                            <BarChart2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className={styles.statValue}>
                                {provider.rating != null && provider.rating > 0
                                    ? provider.rating.toFixed(1)
                                    : '—'}
                            </div>
                            <div className={styles.statLabel}>Calificación Promedio</div>
                        </div>
                    </div>
                </section>

                <div className={styles.gridTwo}>
                    <form action={formAction} className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}><Edit3 className="w-5 h-5" /> Editar Perfil</h2>
                            <button type="submit" className={styles.btnSave} disabled={pending}>
                                <Save className="w-4 h-4 inline mr-2" /> {pending ? 'Guardando…' : 'Guardar'}
                            </button>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="bio">Biografía Profesional</label>
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
                                    <label className={styles.label} htmlFor="price">Precio Consulta (RD$)</label>
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
                                    <label className={styles.label}>WhatsApp Directo</label>
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
                </div>
            </main>
        </div>
    );
}
