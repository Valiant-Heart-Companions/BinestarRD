import Link from 'next/link';
import Logo from './logo';
import { Phone } from 'lucide-react';
import { getUser, getProfile } from '@/lib/auth';
import { signOut } from '@/app/auth/actions';

export default async function Header() {
    const user = await getUser();
    const profile = user ? await getProfile() : null;
    const isAdmin = profile?.role === 'admin';

    return (
        <header style={{
            backgroundColor: 'rgba(252, 250, 247, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(28, 58, 51, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1rem 0'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <nav style={{ flex: 1, display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Link href="/busqueda" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Directorio</Link>
                    <Link href="/preguntas" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Q&A</Link>
                </nav>

                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Logo size="sm" />
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            color: 'var(--color-primary)',
                            marginTop: '2px'
                        }}>BIENESTAR RD</span>
                    </div>
                </Link>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', alignItems: 'center' }}>
                    {isAdmin && (
                        <Link href="/admin" style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            textDecoration: 'none'
                        }}>
                            Admin
                        </Link>
                    )}
                    {user ? (
                        <>
                            <Link href="/provider/dashboard" style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                textDecoration: 'none',
                                border: '1px solid var(--color-primary)',
                                padding: '4px 12px',
                                borderRadius: '20px'
                            }}>
                                Mi Portal
                            </Link>
                            <form action={signOut}>
                                <button type="submit" style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text-muted)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}>
                                    Salir
                                </button>
                            </form>
                        </>
                    ) : (
                        <Link href="/acceso" style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            border: '1px solid var(--color-primary)',
                            padding: '4px 12px',
                            borderRadius: '20px'
                        }}>
                            Especialistas
                        </Link>
                    )}
                    <a href="tel:8092001202" style={{
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none'
                    }}>
                        <Phone size={14} /> Crisis
                    </a>
                </div>
            </div>
        </header>
    );
}
