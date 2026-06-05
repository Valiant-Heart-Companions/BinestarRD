'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import styles from './map.module.css';
import type { UiProvider } from '@/lib/provider-types';
import Link from 'next/link';

// Fix for default Leaflet icons in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    providers: UiProvider[];
    center?: [number, number];
}

export default function Map({ providers, center = [18.4714, -69.9296] }: MapProps) {
    // Center of Santo Domingo by default. Only providers with coordinates are mapped.
    const mappable = providers.filter(
        (p): p is UiProvider & { coordinates: [number, number] } => p.coordinates !== null,
    );

    return (
        <div className={`${styles.mapContainer} ${styles.mapGrayscale}`}>
            <MapContainer
                center={center}
                zoom={9}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappable.map((provider) => (
                    <Marker
                        key={provider.id}
                        position={provider.coordinates}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{provider.name}</h3>
                                {provider.specialties[0] && (
                                    <p className="text-xs text-gray-500">{provider.specialties[0]}</p>
                                )}
                                <Link href={`/perfil/${provider.slug}`} className="text-xs text-[#1C3A33] underline font-bold mt-1 block">
                                    Ver Perfil
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
