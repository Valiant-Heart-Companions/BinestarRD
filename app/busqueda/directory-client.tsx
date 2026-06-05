'use client';

import { useState, useMemo } from 'react';
import type { UiProvider } from '@/lib/provider-types';
import { roleLabel } from '@/lib/provider-types';
import MapWrapper from '@/components/map-wrapper';
import Link from 'next/link';
import { MapPin, Star, DollarSign, CheckCircle } from 'lucide-react';
import styles from './directory.module.css';

export default function DirectoryClient({
    providers,
    initialLocation = '',
    initialInsurance = '',
}: {
    providers: UiProvider[];
    initialLocation?: string;
    initialInsurance?: string;
}) {
    const [location, setLocation] = useState(initialLocation);
    const [insurance, setInsurance] = useState(initialInsurance);
    const [price, setPrice] = useState('all');

    const locationOptions = useMemo(() => {
        const set = new Set<string>();
        for (const p of providers) {
            if (p.location) set.add(p.location);
        }
        if (location) set.add(location);
        return [...set].sort();
    }, [providers, location]);

    const insuranceOptions = useMemo(() => {
        const set = new Set<string>();
        for (const p of providers) {
            for (const ins of p.insurance) set.add(ins);
        }
        if (insurance) set.add(insurance);
        return [...set].sort();
    }, [providers, insurance]);

    const filteredProviders = useMemo(() => {
        return providers.filter(p => {
            if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;

            if (insurance) {
                const accepts = p.insurance.some(i => i.toLowerCase().includes(insurance.toLowerCase()));
                if (!accepts) return false;
            }

            if (price === 'low') {
                if (typeof p.price === 'number' && p.price > 2000) return false;
            } else if (price === 'high') {
                if (typeof p.price === 'number' && p.price <= 2000) return false;
            }

            return true;
        });
    }, [providers, location, insurance, price]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.mainContent}>

                {/* Sidebar List */}
                <aside className={styles.sidebar}>
                    <div className={styles.filters}>
                        <div className={styles.searchHeader}>
                            <h1 className={styles.heading}>Especialistas</h1>
                            <p className={styles.subheading}>{filteredProviders.length} resultados encontrados</p>
                        </div>

                        <div className={styles.filterGrid}>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={styles.select}
                                aria-label="Filtrar por ubicación"
                            >
                                <option value="">Todas las ubicaciones</option>
                                {locationOptions.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>

                            {insuranceOptions.length > 0 && (
                                <select
                                    value={insurance}
                                    onChange={(e) => setInsurance(e.target.value)}
                                    className={styles.select}
                                    aria-label="Filtrar por seguro"
                                >
                                    <option value="">Todos los Seguros</option>
                                    {insuranceOptions.map(ins => (
                                        <option key={ins} value={ins}>{ins}</option>
                                    ))}
                                </select>
                            )}

                            <select
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={styles.select}
                                aria-label="Filtrar por precio"
                            >
                                <option value="all">Cualquier Precio</option>
                                <option value="low">Económico (hasta RD$2,000)</option>
                                <option value="high">Premium (RD$2,000+)</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.list}>
                        {filteredProviders.map(provider => (
                            <Link href={`/perfil/${provider.slug}`} key={provider.id} className="block text-inherit no-underline">
                                <article className={styles.card}>
                                    {provider.isVerified && (
                                        <div className={styles.verifiedBadge}>
                                            <CheckCircle className="w-3 h-3" /> Verificado
                                        </div>
                                    )}
                                    <div className={styles.cardContent}>
                                        {provider.image ? (
                                            <img src={provider.image} alt={provider.name} className={styles.avatar} />
                                        ) : (
                                            <div className={`${styles.avatar} flex items-center justify-center text-gray-400 text-lg font-bold`}>
                                                {provider.name.charAt(0)}
                                            </div>
                                        )}

                                        <div className={styles.info}>
                                            <p className={styles.role}>{roleLabel(provider.role)}</p>
                                            <h3 className={styles.name}>{provider.name}</h3>

                                            {provider.location && (
                                                <div className={styles.detail}>
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {provider.location}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center text-xs text-yellow-500 font-bold">
                                                    {provider.rating != null && provider.rating > 0 ? (
                                                        <>
                                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                                            {provider.rating.toFixed(1)}
                                                            <span className="text-gray-400 font-normal ml-1">({provider.reviewCount})</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 font-normal">Nuevo</span>
                                                    )}
                                                </div>

                                                {typeof provider.price === 'number' ? (
                                                    <span className={styles.priceBadge}>
                                                        <DollarSign className="w-3 h-3 inline pb-[1px]" />
                                                        {provider.price.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Consultar precio</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}

                        {filteredProviders.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No encontramos especialistas con estos filtros. <br /> Intenta ampliar tu búsqueda.
                            </div>
                        )}
                    </div>

                    <div className={styles.listFooter}>
                        ¿Eres especialista y no apareces aquí?{' '}
                        <Link href="/acceso" className="underline">Súmate al directorio</Link>.
                    </div>
                </aside>

                {/* Map Section */}
                <section className={styles.mapSection}>
                    <MapWrapper providers={filteredProviders} />
                </section>
            </div>
        </div>
    );
}
