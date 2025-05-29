export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Convierte una dirección en coordenadas usando Nominatim (OpenStreetMap)
 * Gratuito, sin API key necesaria
 */
export async function geocodeAddress(
  address: string,
): Promise<Coordinates | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=cl`,
    );

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();

    if (data.length === 0) {
      console.warn(`No se encontraron coordenadas para: ${address}`);
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error('Error al geocodificar la dirección:', error);
    return null;
  }
}

/**
 * Coordenadas por defecto para Chile
 */
export const DEFAULT_COORDINATES = {
  santiago: { latitude: -33.4489, longitude: -70.6693 },
  valparaiso: { latitude: -33.0472, longitude: -71.6127 },
  concepcion: { latitude: -36.8201, longitude: -73.0444 },
  rancagua: { latitude: -34.1706, longitude: -70.7407 },
};

/**
 * Obtiene coordenadas de una ciudad conocida
 */
export function getCityCoordinates(cityName: string): Coordinates | null {
  const city = cityName.toLowerCase();

  if (city.includes('santiago')) return DEFAULT_COORDINATES.santiago;
  if (city.includes('valparaíso') || city.includes('valparaiso'))
    return DEFAULT_COORDINATES.valparaiso;
  if (city.includes('concepción') || city.includes('concepcion'))
    return DEFAULT_COORDINATES.concepcion;
  if (city.includes('rancagua')) return DEFAULT_COORDINATES.rancagua;

  return null;
}
