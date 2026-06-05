import Link from 'next/link';

export const metadata = {
    title: 'Política de Privacidad',
    description:
        'Cómo Bienestar RD maneja la información: origen de los perfiles, datos que recopilamos, reseñas, y cómo solicitar la eliminación o corrección de un perfil.',
};

const CONTACT_EMAIL = 'privacidad@mercadeoracional.com';

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                Política de Privacidad
            </h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: junio de 2026</p>

            <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
                <p>
                    Bienestar RD es un directorio de psicólogos y psiquiatras en la
                    República Dominicana. Nuestro objetivo es ayudar a las personas a
                    encontrar atención de salud mental con transparencia y sin
                    intermediarios. Esta política explica qué información manejamos y
                    cómo puedes ejercer control sobre ella.
                </p>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        1. Cómo se crean los perfiles
                    </h2>
                    <p>
                        Para iniciar el directorio incluimos fichas de especialistas
                        elaboradas a partir de <strong>información públicamente disponible</strong>{' '}
                        (por ejemplo, directorios profesionales, sitios de consultorios o
                        perfiles públicos). Estas fichas se muestran con el estado{' '}
                        <strong>«Perfil no reclamado»</strong> y, cuando es posible, indican
                        la fuente de los datos. La información de un perfil no reclamado no
                        ha sido verificada por el especialista.
                    </p>
                    <p className="mt-2">
                        Cualquier especialista puede <strong>reclamar su perfil</strong> para
                        controlarlo, corregir sus datos o solicitar su eliminación.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        2. Información que recopilamos
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Visitantes:</strong> si solo navegas el directorio, no
                            requerimos que crees una cuenta ni recopilamos datos que te
                            identifiquen personalmente.
                        </li>
                        <li>
                            <strong>Especialistas que reclaman un perfil:</strong> correo
                            electrónico, número de WhatsApp y cualquier mensaje que nos envíes
                            para verificar tu identidad.
                        </li>
                        <li>
                            <strong>Usuarios registrados:</strong> usamos un enlace de acceso
                            («magic link») enviado a tu correo. Guardamos tu correo y el rol de
                            tu cuenta (paciente, especialista o administrador).
                        </li>
                        <li>
                            <strong>Preguntas de la comunidad:</strong> se pueden enviar de
                            forma anónima. No publiques datos que te identifiquen; revisa el
                            contenido antes de enviarlo.
                        </li>
                        <li>
                            <strong>Reseñas:</strong> requieren una cuenta para reducir el
                            fraude. Guardamos la calificación, el comentario y la cuenta autora.
                        </li>
                        <li>
                            <strong>Votos («también tengo esta duda» / «útil»):</strong> para
                            evitar votos duplicados guardamos un identificador anónimo en una
                            cookie de tu navegador, o tu cuenta si has iniciado sesión.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        3. Cómo usamos la información
                    </h2>
                    <p>
                        Usamos los datos para operar el directorio: mostrar perfiles,
                        verificar reclamos de especialistas, moderar contenido, publicar
                        preguntas y reseñas, y mejorar el servicio. La conversión ocurre
                        enviándote directamente al WhatsApp del especialista para agendar; no
                        intermediamos esa conversación.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        4. Reseñas y contenido
                    </h2>
                    <p>
                        Las reseñas provienen únicamente de personas reales con una cuenta.{' '}
                        <strong>Nunca inventamos ni atribuimos calificaciones falsas</strong> a
                        especialistas reales. Todo el contenido enviado por la comunidad
                        (preguntas, respuestas y reseñas) pasa por moderación antes de
                        publicarse y puede ser retirado si incumple nuestras normas.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        5. Solicitar corrección o eliminación de un perfil
                    </h2>
                    <p>
                        Si eres un especialista listado y deseas{' '}
                        <strong>corregir o eliminar tu perfil</strong>, tienes dos opciones:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>
                            <strong>Reclama tu perfil</strong> desde la ficha correspondiente
                            para tomar control y editarlo tú mismo.
                        </li>
                        <li>
                            Escríbenos a{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
                                {CONTACT_EMAIL}
                            </a>{' '}
                            indicando el enlace del perfil. Atenderemos las solicitudes de
                            eliminación o corrección en un plazo razonable.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        6. Cookies
                    </h2>
                    <p>
                        Usamos cookies estrictamente necesarias para mantener tu sesión
                        iniciada y para evitar votos duplicados. No usamos cookies de
                        publicidad de terceros.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        7. Seguridad y menores
                    </h2>
                    <p>
                        Tomamos medidas razonables para proteger la información, incluyendo
                        control de acceso a nivel de base de datos. El servicio no está
                        dirigido a menores de edad sin la supervisión de un adulto
                        responsable.
                    </p>
                </section>

                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <h2 className="text-lg font-bold mb-1">Aviso importante</h2>
                    <p>
                        Bienestar RD es un directorio informativo y{' '}
                        <strong>no presta servicios médicos ni de emergencia</strong>. Si tú o
                        alguien más está en crisis, llama a la{' '}
                        <strong>Línea de Vida: 809-200-1202</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        8. Cambios y contacto
                    </h2>
                    <p>
                        Podemos actualizar esta política; publicaremos la fecha de la última
                        actualización en esta página. Para cualquier consulta sobre privacidad
                        escríbenos a{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
                            {CONTACT_EMAIL}
                        </a>
                        .
                    </p>
                </section>

                <p className="pt-4">
                    <Link href="/" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>
                        ← Volver al inicio
                    </Link>
                </p>
            </div>
        </div>
    );
}
