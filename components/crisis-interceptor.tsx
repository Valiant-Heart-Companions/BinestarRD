import styles from './crisis-interceptor.module.css';
import { Phone } from 'lucide-react';

export default function CrisisInterceptor() {
  return (
    <>
      {/* Mobile Sticky Footer */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileContainer}>
          <span className="font-bold">¿Necesitas ayuda urgente?</span>
          <a href="tel:8092001202" className={styles.mobileButton}>
            <Phone className="w-3 h-3 mr-1" /> Llama Ahora
          </a>
        </div>
      </div>

      {/* Desktop Floating Button */}
      <div className={styles.desktopContainer}>
        <a
          href="tel:8092001202"
          className={styles.desktopButton}
          aria-label="Llamar a línea de vida"
        >
          <div className={styles.iconWrapper}>
            <Phone className="w-6 h-6" />
          </div>
          <div className={styles.textGroup}>
            <span className={styles.label}>Línea de Vida</span>
            <span className={styles.phone}>809-200-1202</span>
          </div>
        </a>
      </div>
    </>
  );
}
