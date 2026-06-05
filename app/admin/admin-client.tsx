'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    Check,
    X,
    Shield,
    Eye,
    FolderOpen,
    EyeOff,
    RotateCcw,
} from 'lucide-react';
import type {
    AdminStats,
    DirectoryListing,
    PendingClaim,
    ModQuestion,
    ModAnswer,
    ModReview,
} from '@/lib/admin';
import { roleLabel } from '@/lib/provider-types';
import {
    approveClaimAction,
    rejectClaimAction,
    moderateQuestionAction,
    moderateAnswerAction,
    moderateReviewAction,
    setListingStatusAction,
} from './actions';
import styles from './admin.module.css';

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return 'hace instantes';
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.round(hours / 24);
    if (days < 30) return `hace ${days} d`;
    return new Date(iso).toLocaleDateString('es-DO', {
        day: 'numeric',
        month: 'short',
    });
}

export default function AdminClient({
    stats,
    listings,
    claims,
    questions,
    answers,
    reviews,
}: {
    stats: AdminStats;
    listings: DirectoryListing[];
    claims: PendingClaim[];
    questions: ModQuestion[];
    answers: ModAnswer[];
    reviews: ModReview[];
}) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const moderationCount = questions.length + answers.length + reviews.length;
    const removalCount = stats.listingRemovalRequested;

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
                        onClick={() => setActiveTab('directory')}
                        className={`${styles.menuItem} ${activeTab === 'directory' ? styles.menuItemActive : ''}`}
                    >
                        <FolderOpen className="w-4 h-4 mr-3" /> Directorio
                        {removalCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">{removalCount}</span>
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
                        {activeTab === 'directory' && 'Gestión del Directorio'}
                        {activeTab === 'moderation' && 'Moderación de Contenido'}
                    </h1>
                </div>

                {activeTab === 'dashboard' && (
                    <DashboardTab
                        stats={stats}
                        claimsPending={claims.length}
                        moderationCount={moderationCount}
                        onGoTo={setActiveTab}
                    />
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
                                    <th>Recibido</th>
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
                                        <td className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(c.createdAt)}</td>
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
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">Todo al día. No hay reclamos pendientes.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'directory' && (
                    <DirectoryTab listings={listings} />
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

function DashboardTab({
    stats,
    claimsPending,
    moderationCount,
    onGoTo,
}: {
    stats: AdminStats;
    claimsPending: number;
    moderationCount: number;
    onGoTo: (tab: string) => void;
}) {
    const needsAttention =
        claimsPending + moderationCount + stats.listingRemovalRequested;

    return (
        <>
            {needsAttention > 0 && (
                <div className={styles.attention}>
                    <AlertTriangle className="w-5 h-5" />
                    <span>
                        Tienes <strong>{needsAttention}</strong>{' '}
                        {needsAttention === 1 ? 'asunto' : 'asuntos'} por atender:
                        {claimsPending > 0 && (
                            <button className={styles.attentionLink} onClick={() => onGoTo('validation')}>
                                {claimsPending} {claimsPending === 1 ? 'reclamo' : 'reclamos'}
                            </button>
                        )}
                        {stats.listingRemovalRequested > 0 && (
                            <button className={styles.attentionLink} onClick={() => onGoTo('directory')}>
                                {stats.listingRemovalRequested} {stats.listingRemovalRequested === 1 ? 'remoción' : 'remociones'}
                            </button>
                        )}
                        {moderationCount > 0 && (
                            <button className={styles.attentionLink} onClick={() => onGoTo('moderation')}>
                                {moderationCount} de contenido
                            </button>
                        )}
                    </span>
                </div>
            )}

            <div className={styles.sectionLabel}>Por atender</div>
            <div className={styles.grid}>
                <StatCard label="Reclamos pendientes" value={claimsPending} />
                <StatCard label="Contenido por revisar" value={moderationCount} />
                <StatCard
                    label="Solicitudes de remoción"
                    value={stats.listingRemovalRequested}
                    danger={stats.listingRemovalRequested > 0}
                />
            </div>

            <div className={styles.sectionLabel}>Directorio</div>
            <div className={styles.grid}>
                <StatCard
                    label="Especialistas"
                    value={stats.providersTotal}
                    caption={`${stats.listingActive} visibles · ${stats.listingHidden} ocultos`}
                />
                <StatCard
                    label="Perfiles reclamados"
                    value={stats.providersClaimed}
                    caption={`${stats.providersPending} en revisión · ${stats.providersUnclaimed} sin reclamar`}
                />
                <StatCard
                    label="Miembros fundadores"
                    value={stats.foundingMembers}
                />
            </div>

            <div className={styles.sectionLabel}>Comunidad publicada</div>
            <div className={styles.grid}>
                <StatCard label="Preguntas" value={stats.questionsPublished} />
                <StatCard label="Respuestas" value={stats.answersPublished} />
                <StatCard label="Reseñas" value={stats.reviewsPublished} />
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    caption,
    danger,
}: {
    label: string;
    value: number;
    caption?: string;
    danger?: boolean;
}) {
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>{label}</div>
            <div
                className={styles.cardValue}
                style={danger ? { color: '#B91C1C' } : undefined}
            >
                {value}
            </div>
            {caption && <div className={styles.cardCaption}>{caption}</div>}
        </div>
    );
}

function DirectoryTab({ listings }: { listings: DirectoryListing[] }) {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <span className={styles.tableTitle}>Solicitudes de remoción y perfiles ocultos</span>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Especialista</th>
                        <th>Estado</th>
                        <th>Origen</th>
                        <th>Actualizado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {listings.map((l) => (
                        <tr key={l.id}>
                            <td>
                                <div className="font-bold">{l.name}</div>
                                <div className="text-xs text-gray-500">
                                    {roleLabel(l.role)}{l.location ? ` · ${l.location}` : ''}
                                </div>
                            </td>
                            <td>
                                <span
                                    className={`${styles.status} ${l.listingStatus === 'removal_requested' ? styles.statusFlagged : styles.statusHidden}`}
                                >
                                    {l.listingStatus === 'removal_requested' ? 'Solicitó remoción' : 'Oculto'}
                                </span>
                            </td>
                            <td className="text-xs text-gray-500 max-w-[12rem] truncate" title={l.source ?? ''}>
                                {l.source ?? '—'}
                            </td>
                            <td className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(l.updatedAt)}</td>
                            <td>
                                <div className={styles.actions}>
                                    <a href={`/perfil/${l.slug}`} target="_blank" rel="noopener noreferrer" className={styles.btnApprove} title="Ver perfil" style={{ background: '#e5e7eb', color: '#374151' }}>
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    {l.listingStatus === 'removal_requested' ? (
                                        <form action={setListingStatusAction}>
                                            <input type="hidden" name="id" value={l.id} />
                                            <input type="hidden" name="status" value="hidden" />
                                            <button className={styles.btnTextReject} title="Ocultar perfil del directorio">
                                                <EyeOff className="w-4 h-4 inline mr-1" /> Ocultar
                                            </button>
                                        </form>
                                    ) : (
                                        <form action={setListingStatusAction}>
                                            <input type="hidden" name="id" value={l.id} />
                                            <input type="hidden" name="status" value="active" />
                                            <button className={styles.btnTextApprove} title="Volver a publicar">
                                                <RotateCcw className="w-4 h-4 inline mr-1" /> Restaurar
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {listings.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-8 text-gray-400">No hay solicitudes de remoción ni perfiles ocultos.</td></tr>
                    )}
                </tbody>
            </table>
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
