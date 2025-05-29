'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useGeocoding } from '@/hooks/use-geocoding';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  readonly latitude?: number;
  readonly longitude?: number;
  readonly address?: string;
  readonly title: string;
}

export default function LeafletMap({
  latitude,
  longitude,
  address,
  title,
}: LeafletMapProps) {
  const { coordinates, isLoading, error } = useGeocoding({
    address,
    latitude,
    longitude,
  });

  if (isLoading) {
    return (
      <div className='w-full h-[200px] rounded-lg bg-muted flex items-center justify-center border border-border'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-muted-foreground'>Cargando ubicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {error && (
        <div className='text-xs text-warning bg-warning/10 px-2 py-1 rounded'>
          {error}
        </div>
      )}
      <div className='w-full h-[200px] rounded-lg overflow-hidden border border-border'>
        <MapContainer
          center={[coordinates.latitude, coordinates.longitude]}
          zoom={15}
          scrollWheelZoom={false}
          className='w-full h-full'
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={[coordinates.latitude, coordinates.longitude]}>
            <Popup>
              <div className='text-center'>
                <strong>{title}</strong>
                {address && (
                  <>
                    <br />
                    <span className='text-sm'>{address}</span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
