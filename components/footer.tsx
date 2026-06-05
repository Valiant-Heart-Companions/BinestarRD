import Link from 'next/link';
import { Phone } from 'lucide-react';
import styles from './footer.module.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.inner}>
                    <div>
                        <div className={styles.brand}>Bienestar RD</div>
                        <p className={styles.tagline}>
                            Directorio de psicólogos y psiquiatras verificados de la
                            República Dominicana. Precios claros y contacto directo, sin
                            intermediarios.
                        </p>
                    </div>

                    <div>
                        <h2 className={styles.colTitle}>Explorar</h2>
                        <nav className={styles.links}>
                            <Link href="/busqueda" className={styles.link}>Directorio</Link>
                            <Link href="/preguntas" className={styles.link}>Preguntas y respuestas</Link>
                            <Link href="/preguntas/nueva" className={styles.link}>Hacer una pregunta</Link>
                            <Link href="/acceso" className={styles.link}>Soy especialista</Link>
                        </nav>
                    </div>

                    <div>
                        <h2 className={styles.colTitle}>Ayuda y legal</h2>
                        <nav className={styles.links}>
                            <Link href="/legal/privacidad" className={styles.link}>Política de privacidad</Link>
                            <a href="tel:8092001202" className={styles.crisis}>
                                <Phone size={14} /> Línea de Vida: 809-200-1202
                            </a>
                            <p className={styles.crisisNote}>
                                Si estás en crisis o tienes pensamientos de hacerte daño,
                                llama ahora. Atención 24/7.
                            </p>
                        </nav>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span>© {year} Bienestar RD. Todos los derechos reservados.</span>
                    <span>Hecho en República Dominicana</span>
                </div>
            </div>
        </footer>
    );
}
