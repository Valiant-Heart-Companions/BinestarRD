import Link from 'next/link';
import Logo from './logo';
import { Phone } from 'lucide-react';
import { getUser, getProfile } from '@/lib/auth';
import { signOut } from '@/app/auth/actions';
import styles from './header.module.css';

export default async function Header() {
    const user = await getUser();
    const profile = user ? await getProfile() : null;
    const isAdmin = profile?.role === 'admin';

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <nav className={styles.nav}>
                    <Link href="/busqueda" className={styles.navLink}>Directorio</Link>
                    <Link href="/preguntas" className={styles.navLink}>Q&A</Link>
                </nav>

                <Link href="/" className={styles.brandLink}>
                    <div className={styles.brand}>
                        <Logo size="sm" />
                        <span className={styles.brandName}>BIENESTAR RD</span>
                    </div>
                </Link>

                <div className={styles.actions}>
                    {isAdmin && (
                        <Link href="/admin" className={styles.adminLink}>
                            Admin
                        </Link>
                    )}
                    {user ? (
                        <>
                            <Link href="/provider/dashboard" className={styles.pill}>
                                Mi Portal
                            </Link>
                            <form action={signOut}>
                                <button type="submit" className={styles.signOut}>
                                    Salir
                                </button>
                            </form>
                        </>
                    ) : (
                        <Link href="/acceso" className={styles.pill}>
                            Especialistas
                        </Link>
                    )}
                    <a href="tel:8092001202" className={styles.crisis} aria-label="Llamar a la línea de crisis">
                        <Phone size={14} /> Crisis
                    </a>
                </div>
            </div>
        </header>
    );
}
