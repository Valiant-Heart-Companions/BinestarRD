import { getProviders } from '@/lib/providers';
import DirectoryClient from './directory-client';

export const metadata = {
    title: 'Directorio de Psicólogos y Psiquiatras',
    description: 'Encuentra especialistas de salud mental verificados en República Dominicana. Filtra por ubicación, seguro y precio.',
};

export default async function DirectoryPage({
    searchParams,
}: {
    searchParams: Promise<{ ubicacion?: string; seguro?: string }>;
}) {
    const { ubicacion, seguro } = await searchParams;
    const providers = await getProviders();
    return (
        <DirectoryClient
            providers={providers}
            initialLocation={ubicacion ?? ''}
            initialInsurance={seguro ?? ''}
        />
    );
}
