// lib/secure-storage.ts
import { EncryptionService } from './encryption';

export class SecureStorage {
  static setItem(key: string, value: string, encrypt: boolean = true): void {
    try {
      const dataToStore = encrypt ? EncryptionService.encrypt(value) : value;
      localStorage.setItem(key, dataToStore);
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  }

  static getItem(key: string, decrypt: boolean = true): string | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      if (decrypt && EncryptionService.isEncrypted(item)) {
        return EncryptionService.decrypt(item);
      }

      return item;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  static setAuthData(token: string, user: any): void {
    try {
      this.setItem('token', token, true);
      const userData = JSON.stringify(user);
      this.setItem('user', userData, true);
    } catch (error) {
      console.error('Error during setting auth data:', error);
    }
  }

  static getAuthData(): { token: string | null; user: any } {
    const token = this.getItem('token', true);
    const userData = this.getItem('user', true);

    let user = null;
    if (userData) {
      try {
        user = typeof userData === 'string' ? JSON.parse(userData) : userData;
      } catch (error) {
        console.error('Error during parsing user data:', error);
      }
    }

    return { token, user };
  }

  static clearAuthData(): void {
    try {
      this.removeItem('token');
      this.removeItem('user');

      const legacyKeys = [
        'auth_token',
        'auth_user',
        'access_token',
        'access_token_backup',
        'user_backup',
      ];

      legacyKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error during clearing auth data:', error);
    }
  }

  static migrateUnencryptedData(): void {
    try {
      const existingToken = localStorage.getItem('token');
      const existingUser = localStorage.getItem('user');

      if (existingToken && !EncryptionService.isEncrypted(existingToken)) {
        this.setItem('token', existingToken, true);
      }

      if (existingUser && !EncryptionService.isEncrypted(existingUser)) {
        this.setItem('user', existingUser, true);
      }
    } catch (error) {
      console.error('Error during migration of unencrypted data:', error);
    }
  }
}
