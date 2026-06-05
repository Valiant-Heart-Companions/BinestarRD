import type { Metadata } from 'next'
import { Outfit, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import CrisisInterceptor from '@/components/crisis-interceptor'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-cormorant',
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} | Encuentra tu paz mental`,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        locale: 'es_DO',
        siteName: SITE_NAME,
        title: `${SITE_NAME} | Encuentra tu paz mental`,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | Encuentra tu paz mental`,
        description: SITE_DESCRIPTION,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className={`${outfit.variable} ${cormorant.variable}`}>
            <body className={outfit.className}>
                <Header />
                <main>{children}</main>
                <Footer />
                <CrisisInterceptor />
            </body>
        </html>
    )
}
