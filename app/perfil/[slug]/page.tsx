import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Shield, Star, MessageCircle, Phone, Info } from 'lucide-react';
import { getProviderBySlug, roleLabel, providerContactLinks } from '@/lib/providers';
import { getPublishedReviews, getMyReviewState } from '@/lib/reviews';
import { SITE_URL } from '@/lib/site';
import ReviewsSection from './reviews-section';
import ProviderAvatar from '@/components/provider-avatar';
import styles from '../profile.module.css';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const provider = await getProviderBySlug(slug);
    if (!provider) return {};
    const title = `${provider.name} — ${roleLabel(provider.role)}`;
    const description =
        provider.bio?.slice(0, 150) ||
        `Perfil de ${provider.name}, ${roleLabel(provider.role).toLowerCase()} en ${provider.location || 'República Dominicana'}.`;
    return {
        title,
        description,
        alternates: { canonical: `/perfil/${provider.slug}` },
        openGraph: {
            type: 'profile',
            title,
            description,
            url: `/perfil/${provider.slug}`,
            images: provider.image ? [{ url: provider.image }] : undefined,
        },
    };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const provider = await getProviderBySlug(slug);

    if (!provider) {
        notFound();
    }

    const [reviews, myReview] = await Promise.all([
        getPublishedReviews(provider.id),
        getMyReviewState(provider.id, provider.ownerId),
    ]);

    const digits = (n: string) => n.replace(/\D/g, '');
    const whatsappMessage = `Hola ${provider.name}, le vi en Bienestar RD y me gustaría agendar una consulta.`;
    const { phoneUrl, phoneDisplay, whatsappUrl } = providerContactLinks(provider, whatsappMessage);
    // WhatsApp is offered as a secondary path; when it's the only known channel
    // it takes the primary (filled) treatment instead.
    const whatsappPrimary = !phoneUrl;

    const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': provider.role === 'psychiatrist' ? 'Physician' : 'MedicalBusiness',
        name: provider.name,
        url: `${SITE_URL}/perfil/${provider.slug}`,
        medicalSpecialty: roleLabel(provider.role),
        areaServed: 'República Dominicana',
        ...(provider.bio ? { description: provider.bio } : {}),
        ...(provider.image ? { image: provider.image } : {}),
        ...(provider.phone || provider.whatsapp
            ? { telephone: `+1${digits(provider.phone || provider.whatsapp || '')}` }
            : {}),
        ...(provider.location
            ? {
                  address: {
                      '@type': 'PostalAddress',
                      addressLocality: provider.location,
                      addressCountry: 'DO',
                  },
              }
            : {}),
        ...(typeof provider.price === 'number'
            ? { priceRange: `RD$${provider.price.toLocaleString()}` }
            : {}),
        ...(provider.rating != null && provider.rating > 0 && provider.reviewCount > 0
            ? {
                  aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: provider.rating,
                      reviewCount: provider.reviewCount,
                      bestRating: 5,
                      worstRating: 1,
                  },
              }
            : {}),
    };

    return (
        <article className={styles.profileContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Breadcrumb equivalent */}
            <div className="text-sm text-gray-500 mb-6">
                <Link href="/busqueda" className="hover:underline">← Volver al Directorio</Link>
            </div>

            {provider.claimStatus === 'pending' && (
                <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    <p className="font-semibold">Reclamo en revisión</p>
                    <p className="mt-1">
                        Un profesional solicitó el control de este perfil. Estamos verificando su
                        identidad antes de darle acceso.
                    </p>
                </div>
            )}

            {provider.claimStatus === 'unclaimed' && (
                <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-semibold">Perfil no reclamado</p>
                    <p className="mt-1">
                        Esta ficha fue creada a partir de información pública
                        {provider.source ? (
                            <>
                                {' '}(
                                <a
                                    href={provider.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    fuente
                                </a>
                                )
                            </>
                        ) : null}
                        . Los datos no han sido verificados por el especialista.
                    </p>
                    <p className="mt-2">
                        ¿Eres este profesional?{' '}
                        <Link href={`/perfil/${provider.slug}/reclamar`} className="font-semibold underline">
                            Reclama tu perfil
                        </Link>
                        {' '}o{' '}
                        <Link href="/legal/privacidad" className="font-semibold underline">
                            solicita su eliminación
                        </Link>
                        .
                    </p>
                </div>
            )}

            <div className={styles.header}>
                <div className={styles.imageContainer}>
                    <ProviderAvatar
                        src={provider.image}
                        name={provider.name}
                        fill
                        sizes="200px"
                        className={styles.image}
                    />
                </div>

                <div className={styles.headerInfo}>
                    <div className={styles.badgeStack}>
                        {provider.isVerified && (
                            <span className={`${styles.badge} ${styles.badgeVerified}`}>Verificado</span>
                        )}
                        {provider.isFoundingMember && (
                            <span className={`${styles.badge} ${styles.badgeFounder}`}>Miembro Fundador</span>
                        )}
                    </div>

                    <h1 className={styles.name}>{provider.name}</h1>
                    <p className={styles.role}>{roleLabel(provider.role, true)}</p>

                    <div className={styles.rating}>
                        {provider.rating != null && provider.rating > 0 ? (
                            <>
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className="text-lg text-gray-900">{provider.rating.toFixed(1)}</span>
                                <span className="text-gray-500 font-normal">({provider.reviewCount} reseñas)</span>
                            </>
                        ) : (
                            <span className="text-gray-500 font-normal">Aún sin reseñas</span>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Main Content */}
                <div className="space-y-8">
                    <section>
                        <h2 className={styles.sectionTitle}>
                            <Info className="w-5 h-5 text-[#1C3A33]" /> Perfil profesional
                        </h2>
                        <p className={styles.bio}>
                            {provider.bio || 'Este especialista todavía no ha añadido una descripción.'}
                        </p>
                    </section>

                    {provider.specialties.length > 0 && (
                        <section>
                            <h2 className={styles.sectionTitle}>Especialidades</h2>
                            <div className={styles.tagContainer}>
                                {provider.specialties.map(spec => (
                                    <span key={spec} className={styles.tag}>{spec}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className={styles.sectionTitle}>Seguros aceptados</h2>
                        <div className="flex gap-4 flex-wrap">
                            {provider.insurance.length > 0 ? (
                                provider.insurance.map(ins => (
                                    <div key={ins} className="flex items-center text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg">
                                        <Shield className="w-4 h-4 text-green-600 mr-2" /> {ins}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">Información de seguros no disponible. Consulta directamente con el especialista.</p>
                            )}
                        </div>
                    </section>

                    <ReviewsSection
                        providerId={provider.id}
                        slug={provider.slug}
                        reviews={reviews}
                        myStatus={myReview.status}
                        isSelf={myReview.isSelf}
                        isAuthed={myReview.isAuthed}
                    />
                </div>

                {/* Sidebar Actions */}
                <aside className="space-y-6">
                    <div className={styles.sidebarCard}>
                        {provider.location && (
                            <div className={styles.infoRow}>
                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                <div className={styles.infoContent}>
                                    <div className={styles.label}>Ubicación</div>
                                    <div className={styles.value}>{provider.location}</div>
                                </div>
                            </div>
                        )}

                        <div className={styles.infoRow}>
                            <Star className="w-5 h-5 text-gray-400 mt-1" />
                            <div className={styles.infoContent}>
                                <div className={styles.label}>Precio de consulta</div>
                                {typeof provider.price === 'number' ? (
                                    <div className={styles.priceValue}>RD$ {provider.price.toLocaleString()}</div>
                                ) : (
                                    <div className="text-gray-500 italic">Consultar</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {phoneUrl && (
                                <a href={phoneUrl} className={styles.callBtn}>
                                    <Phone className="w-5 h-5 mr-2" />
                                    Llamar al consultorio
                                </a>
                            )}
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={whatsappPrimary ? styles.whatsappBtn : styles.whatsappBtnSecondary}
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Escribir por WhatsApp
                                </a>
                            )}
                            {phoneDisplay && (
                                <p className="text-sm text-center text-gray-600">{phoneDisplay}</p>
                            )}
                            {phoneUrl || whatsappUrl ? (
                                <p className="text-xs text-center text-gray-500 px-4">
                                    {provider.claimStatus === 'claimed'
                                        ? 'Coordina tu consulta directamente con el especialista, sin intermediarios.'
                                        : 'Datos de contacto obtenidos de fuentes públicas. Conviene confirmarlos al agendar.'}
                                </p>
                            ) : (
                                <p className="text-sm text-center text-gray-500 px-4">
                                    Datos de contacto no disponibles todavía.
                                </p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </article>
    );
}
