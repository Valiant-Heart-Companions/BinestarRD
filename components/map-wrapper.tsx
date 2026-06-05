'use client';

import dynamic from 'next/dynamic';
import type { UiProvider } from '@/lib/provider-types';

const MapClient = dynamic(() => import('./map'), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center text-gray-400">Cargando Mapa...</div>
});

export default function MapWrapper(props: { providers: UiProvider[] }) {
    return <MapClient {...props} />;
}
