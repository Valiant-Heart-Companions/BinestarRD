'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, AlertTriangle, Check, X, Shield, Eye } from 'lucide-react';
import type { PendingClaim, ModQuestion, ModAnswer, ModReview } from '@/lib/admin';
import {
    approveClaimAction,
    rejectClaimAction,
    moderateQuestionAction,
    moderateAnswerAction,
    moderateReviewAction,
} from './actions';
import styles from './admin.module.css';

export default function AdminClient({
    claims,
    questions,
    answers,
    reviews,
}: {
    claims: PendingClaim[];
    questions: ModQuestion[];
    answers: ModAnswer[];
    reviews: ModReview[];
}) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const moderationCount = questions.length + answers.length + reviews.length;

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <Shield className="w-6 h-6" /> Bienestar Admin
                </div>
                <nav className={styles.menu}>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`${styles.menuItem} ${activeTab === 'dashboard' ? styles.menuItemActive : ''}`}
                    >
                        <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('validation')}
                        className={`${styles.menuItem} ${activeTab === 'validation' ? styles.menuItemActive : ''}`}
                    >
                        <Users className="w-4 h-4 mr-3" /> Validaciones
                        {claims.length > 0 && (
                            <span className="ml-auto bg-yellow-500 text-black text-xs px-2 rounded-full">{claims.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('moderation')}
                        className={`${styles.menuItem} ${activeTab === 'moderation' ? styles.menuItemActive : ''}`}
                    >
                        <AlertTriangle className="w-4 h-4 mr-3" /> Moderación
                        {moderationCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">{moderationCount}</span>
                        )}
                    </button>
                </nav>
            </aside>

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {activeTab === 'dashboard' && 'Panel de Control'}
                        {activeTab === 'validation' && 'Cola de Validación'}
                        {activeTab === 'moderation' && 'Moderación de Contenido'}
                    </h1>
                </div>

                {activeTab === 'dashboard' && (
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>Reclamos Pendientes</div>
                            <div className={styles.cardValue}>{claims.length}</div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>Contenido por Revisar</div>
                            <div className={styles.cardValue}>{moderationCount}</div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>Reseñas en Cola</div>
                            <div className={styles.cardValue}>{reviews.length}</div>
                        </div>
                    </div>
                )}

                {activeTab === 'validation' && (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeader}>
                            <span className={styles.tableTitle}>Solicitudes de Reclamo</span>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Especialista</th>
                                    <th>Solicitante</th>
                                    <th>Mensaje</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="font-bold">{c.providerName}</div>
                                            <div className="text-xs text-gray-500">{c.providerLocation ?? '—'}</div>
                                        </td>
                                        <td>
                                            <div className="text-xs">{c.claimantEmail ?? '—'}</div>
                                            <div className="text-xs text-gray-500">{c.claimantWhatsapp ?? ''}</div>
                                        </td>
                                        <td className="max-w-xs text-xs text-gray-600">{c.message ?? '—'}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <a href={`/perfil/${c.providerSlug}`} target="_blank" rel="noopener noreferrer" className={styles.btnApprove} title="Ver perfil" style={{ background: '#e5e7eb', color: '#374151' }}>
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                <form action={approveClaimAction}>
                                                    <input type="hidden" name="id" value={c.id} />
                                                    <button className={styles.btnApprove} title="Aprobar reclamo"><Check className="w-4 h-4" /></button>
                                                </form>
                                                <form action={rejectClaimAction}>
                                                    <input type="hidden" name="id" value={c.id} />
                                                    <button className={styles.btnReject} title="Rechazar"><X className="w-4 h-4" /></button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {claims.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-400">Todo al día. No hay reclamos pendientes.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'moderation' && (
                    <div className="space-y-8">
                        <ModerationTable
                            title="Preguntas"
                            emptyText="No hay preguntas por revisar."
                            action={moderateQuestionAction}
                            rows={questions.map((q) => ({
                                id: q.id,
                                status: q.status,
                                primary: q.title,
                                secondary: q.body,
                            }))}
                        />
                        <ModerationTable
                            title="Respuestas"
                            emptyText="No hay respuestas por revisar."
                            action={moderateAnswerAction}
                            rows={answers.map((a) => ({
                                id: a.id,
                                status: a.status,
                                primary: `${a.providerName} → ${a.questionTitle}`,
                                secondary: a.body,
                            }))}
                        />
                        <ModerationTable
                            title="Reseñas"
                            emptyText="No hay reseñas por revisar."
                            action={moderateReviewAction}
                            rows={reviews.map((r) => ({
                                id: r.id,
                                status: r.status,
                                primary: `${r.providerName} · ${'★'.repeat(r.rating)}`,
                                secondary: r.body ?? '(sin comentario)',
                            }))}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

type ModRow = { id: string; status: string; primary: string; secondary: string };

function ModerationTable({
    title,
    emptyText,
    rows,
    action,
}: {
    title: string;
    emptyText: string;
    rows: ModRow[];
    action: (formData: FormData) => Promise<void>;
}) {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>{title}</span>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Contenido</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td className="max-w-md">
                                <div className="font-bold">{row.primary}</div>
                                <div className="text-xs text-gray-500 line-clamp-2">{row.secondary}</div>
                            </td>
                            <td>
                                <span className={`${styles.status} ${row.status === 'flagged' ? styles.statusFlagged : styles.statusPending}`}>
                                    {row.status === 'flagged' ? 'Reportado' : 'Pendiente'}
                                </span>
                            </td>
                            <td>
                                <div className={styles.actions}>
                                    <form action={action}>
                                        <input type="hidden" name="id" value={row.id} />
                                        <input type="hidden" name="status" value="published" />
                                        <button className={styles.btnApprove} title="Publicar"><Check className="w-4 h-4" /></button>
                                    </form>
                                    <form action={action}>
                                        <input type="hidden" name="id" value={row.id} />
                                        <input type="hidden" name="status" value="removed" />
                                        <button className={styles.btnReject} title="Eliminar"><X className="w-4 h-4" /></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr><td colSpan={3} className="text-center py-8 text-gray-400">{emptyText}</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
