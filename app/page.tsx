import Link from 'next/link';
import { MapPin, Shield, Star, ArrowRight, Search, DollarSign, MessageCircle } from 'lucide-react';
import { getFeaturedProviders, roleLabel } from '@/lib/providers';
import { getPublishedQuestions } from '@/lib/questions';
import HeroSearch from './hero-search';
import styles from './home.module.css';

export default async function Home() {
    const [featuredDoctors, allQuestions] = await Promise.all([
        getFeaturedProviders(4),
        getPublishedQuestions(),
    ]);
    const topQuestions = allQuestions.slice(0, 3);

    return (
        <main className="pb-20">
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.pattern}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        Encuentra tu <span className={styles.highlight}>paz mental</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Psicólogos y psiquiatras de la República Dominicana, con precios
                        claros. Agenda directo por WhatsApp, sin costos ocultos ni
                        intermediarios.
                    </p>

                    <HeroSearch />

                    <div className={styles.badges}>
                        <span className="flex items-center"><Star className={styles.badgeIcon} /> Perfiles verificados</span>
                        <span className="flex items-center"><Shield className={styles.badgeIcon} /> Precios transparentes</span>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className={styles.steps}>
                <div className={styles.stepsInner}>
                    <h2 className={styles.stepsHeading}>Tu bienestar en tres pasos</h2>
                    <p className={styles.stepsSub}>
                        Buscar apoyo en salud mental no tiene por qué ser complicado.
                        Así de simple funciona Bienestar RD.
                    </p>

                    <div className={styles.stepsGrid}>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><Search className="w-6 h-6" /></div>
                            <div className={styles.stepNum}>Paso 1</div>
                            <h3 className={styles.stepTitle}>Busca</h3>
                            <p className={styles.stepDesc}>
                                Filtra por ubicación, seguro y precio para encontrar al
                                especialista que se ajusta a ti.
                            </p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><DollarSign className="w-6 h-6" /></div>
                            <div className={styles.stepNum}>Paso 2</div>
                            <h3 className={styles.stepTitle}>Compara</h3>
                            <p className={styles.stepDesc}>
                                Revisa perfiles verificados, especialidades y precios
                                claros, sin sorpresas ni costos ocultos.
                            </p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepIcon}><MessageCircle className="w-6 h-6" /></div>
                            <div className={styles.stepNum}>Paso 3</div>
                            <h3 className={styles.stepTitle}>Agenda</h3>
                            <p className={styles.stepDesc}>
                                Escribe directo al WhatsApp del especialista y coordina tu
                                primera consulta. Sin intermediarios.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Providers */}
            {featuredDoctors.length > 0 && (
                <section className={styles.sectionAlt}>
                    <div className="container mx-auto">
                        <div className={styles.sectionHeader}>
                            <div>
                                <h2 className={styles.sectionTitle}>Especialistas destacados</h2>
                                <p className={styles.sectionDesc}>Psicólogos y psiquiatras verificados, listos para atenderte.</p>
                            </div>
                            <Link href="/busqueda" className={styles.link}>
                                Ver directorio <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                        <div className={`${styles.grid} ${styles.grid4}`}>
                            {featuredDoctors.map(doc => (
                                <Link href={`/perfil/${doc.slug}`} key={doc.id} className={`${styles.providerCard} block text-inherit no-underline`}>
                                    <div className={styles.imageWrapper}>
                                        {doc.image ? (
                                            <img src={doc.image} alt={doc.name} className={styles.providerImage} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300">Sin foto</div>
                                        )}
                                        {doc.isFoundingMember && (
                                            <div className={styles.badge}>
                                                Fundador
                                            </div>
                                        )}
                                    </div>
                                    <h3 className={styles.providerName}>{doc.name}</h3>
                                    <p className={styles.providerRole}>{roleLabel(doc.role)}</p>
                                    {doc.location && (
                                        <p className={styles.providerLoc}>
                                            <MapPin className="w-3 h-3 mr-1" /> {doc.location.split(',')[0]}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Popular Q&A Section */}
            <section className={styles.section}>
                <div className="container mx-auto">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Preguntas de la comunidad</h2>
                            <p className={styles.sectionDesc}>Dudas reales sobre salud mental, respondidas por especialistas verificados.</p>
                        </div>
                        <Link href="/preguntas" className={styles.link}>
                            Ver todas <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>

                    {topQuestions.length > 0 ? (
                        <div className={styles.grid}>
                            {topQuestions.map(q => (
                                <div key={q.id} className={styles.card}>
                                    {q.category && (
                                        <span className={styles.category}>
                                            {q.category}
                                        </span>
                                    )}
                                    <h3 className={styles.cardTitle}>
                                        <Link href={`/preguntas/${q.slug}`} className="hover:underline">
                                            {q.title}
                                        </Link>
                                    </h3>
                                    <p className={styles.cardBody}>
                                        {q.body}
                                    </p>
                                    <div className={styles.cardFooter}>
                                        <div className="flex items-center">
                                            <span className="font-medium text-[#1C3A33]">{q.answerCount} respuestas</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Aún no hay preguntas publicadas. ¿Tienes una duda? Sé la primera persona en preguntar.
                        </div>
                    )}

                    <div className={styles.ctaCenter}>
                        <Link href="/preguntas/nueva" className={styles.ctaBtn}>
                            Hacer una pregunta anónima
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
