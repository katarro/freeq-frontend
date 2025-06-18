// lib/rut-formatter.ts

/**
 * Formatea un RUT mientras el usuario escribe
 * @param value - Valor actual del input
 * @returns Valor formateado en formato XX.XXX.XXX-X
 */
export function formatRut(value: string): string {
  // Remover todo excepto números y K/k
  const cleanValue = value.replace(/[^0-9Kk]/g, '');

  // Si está vacío, devolver vacío
  if (!cleanValue) return '';

  // Convertir k minúscula a mayúscula
  const normalizedValue = cleanValue.toUpperCase();

  // Separar el dígito verificador del resto
  const body = normalizedValue.slice(0, -1);
  const dv = normalizedValue.slice(-1);

  // Si solo hay un carácter, devolverlo sin formato
  if (normalizedValue.length <= 1) return normalizedValue;

  // Formatear el cuerpo del RUT con puntos
  let formattedBody = '';
  const bodyReversed = body.split('').reverse();

  for (let i = 0; i < bodyReversed.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedBody = '.' + formattedBody;
    }
    formattedBody = bodyReversed[i] + formattedBody;
  }

  // Si tenemos dígito verificador, agregarlo con guión
  if (dv && body.length > 0) {
    return `${formattedBody}-${dv}`;
  }

  return formattedBody;
}

/**
 * Limpia el RUT removiendo puntos y guiones para validación
 * @param formattedRut - RUT formateado
 * @returns RUT sin formato
 */
export function cleanRut(formattedRut: string): string {
  return formattedRut.replace(/[.-]/g, '');
}

/**
 * Valida el formato de RUT chileno
 * @param rut - RUT a validar
 * @returns true si el formato es válido
 */
export function validateRutFormat(rut: string): boolean {
  const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
  return rutPattern.test(rut);
}
