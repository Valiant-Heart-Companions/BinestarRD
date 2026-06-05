'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Shield } from 'lucide-react';
import styles from './home.module.css';

export default function HeroSearch() {
    const router = useRouter();
    const [location, setLocation] = useState('');
    const [insurance, setInsurance] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location.trim()) params.set('ubicacion', location.trim());
        if (insurance) params.set('seguro', insurance);
        const qs = params.toString();
        router.push(qs ? `/busqueda?${qs}` : '/busqueda');
    };

    return (
        <form className={styles.searchBox} onSubmit={submit}>
            <div className={styles.inputGroup}>
                <MapPin className={styles.inputIcon} />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="¿Dónde buscas? Ej: Naco"
                    className={styles.input}
                    aria-label="Ubicación"
                />
            </div>
            <div className={styles.inputGroup}>
                <Shield className={styles.inputIcon} />
                <select
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className={styles.select}
                    aria-label="Seguro médico"
                >
                    <option value="">Seguro médico (opcional)</option>
                    <option value="Humano">ARS Humano</option>
                    <option value="Universal">ARS Universal</option>
                    <option value="Senasa">Senasa</option>
                    <option value="Palic">Palic</option>
                </select>
            </div>
            <button type="submit" className={styles.searchBtn}>
                Buscar
            </button>
        </form>
    );
}
