// src/hooks/use-geocoding.ts
'use client';

import { useState, useEffect } from 'react';
import {
  geocodeAddress,
  getCityCoordinates,
  DEFAULT_COORDINATES,
  type Coordinates,
} from '@/lib/geocoding';

interface UseGeocodingProps {
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface UseGeocodingReturn {
  coordinates: Coordinates;
  isLoading: boolean;
  error: string | null;
}

export function useGeocoding({
  address,
  latitude,
  longitude,
}: UseGeocodingProps): UseGeocodingReturn {
  const [coordinates, setCoordinates] = useState<Coordinates>(
    DEFAULT_COORDINATES.santiago,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya tenemos coordenadas explícitas, usarlas
    if (latitude && longitude) {
      setCoordinates({ latitude, longitude });
      return;
    }

    // Si no hay dirección, usar Santiago por defecto
    if (!address) {
      setCoordinates(DEFAULT_COORDINATES.santiago);
      return;
    }

    const getCoordinates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Primero intentar con ciudades conocidas (más rápido)
        const cityCoords = getCityCoordinates(address);
        if (cityCoords) {
          setCoordinates(cityCoords);
          setIsLoading(false);
          return;
        }

        // Si no es una ciudad conocida, usar geocoding
        const geocodedCoords = await geocodeAddress(address);
        if (geocodedCoords) {
          setCoordinates(geocodedCoords);
        } else {
          // Fallback a Santiago
          setCoordinates(DEFAULT_COORDINATES.santiago);
          setError(
            'No se pudo ubicar la dirección, mostrando ubicación por defecto',
          );
        }
      } catch (err) {
        setError('Error al obtener coordenadas');
        setCoordinates(DEFAULT_COORDINATES.santiago);
      } finally {
        setIsLoading(false);
      }
    };

    getCoordinates();
  }, [address, latitude, longitude]);

  return { coordinates, isLoading, error };
}
