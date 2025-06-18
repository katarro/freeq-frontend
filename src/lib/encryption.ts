// lib/encryption.ts
import CryptoJS from 'crypto-js';
import { ENV } from './env';

// Clave de encriptación desde configuración validada
const ENCRYPTION_KEY = ENV.ENCRYPTION_KEY ?? '';

export class EncryptionService {
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Error al encriptar:', error);
      return data; // Fallback
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error al desencriptar:', error);
      return encryptedData; // Fallback
    }
  }

  static isEncrypted(data: string): boolean {
    try {
      // Intentar desencriptar para verificar si es válido
      const decrypted = this.decrypt(data);
      return decrypted !== data && decrypted.length > 0;
    } catch {
      return false;
    }
  }
}

// Utilidades para JWT
export class JWTUtils {
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true; // Si hay error, considerar como expirado
    }
  }

  static getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error al extraer payload del token:', error);
      return null;
    }
  }

  static isValidJWT(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Verificar que se pueda decodificar el header y payload
      JSON.parse(atob(parts[0]));
      JSON.parse(atob(parts[1]));

      return true;
    } catch {
      return false;
    }
  }
}
