// lib/AuthService.ts
import { LoginDto, RegisterUserDto, AuthResponse } from '@/types/auth';
import { SecureStorage } from '@/lib/secure-storage';
import { JWTUtils } from '@/lib/encryption';
import { ENV } from '@/lib/env';
import apiClient from '@/lib/api-client';

class AuthService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = ENV.API_URL ?? '';
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      // ✅ DEBUG: Verificar URL que se está usando
      console.log('🔧 DEBUG - URL de API:', ENV.API_URL);
      console.log(
        '🔧 DEBUG - Base URL de apiClient:',
        apiClient.defaults.baseURL,
      );
      console.log(
        '🔧 DEBUG - Request URL completa:',
        ENV.API_URL + '/auth/iniciar-sesion',
      );

      const response = await apiClient.post(
        '/auth/iniciar-sesion',
        credentials,
      );
      const data: AuthResponse = response.data;

      this.validateAuthResponse(data);
      return data;
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Error ${error.response.status}: ${error.response.statusText}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        );
      } else {
        throw new Error(error.message || 'Error inesperado en la petición');
      }
    }
  }

  async register(userData: RegisterUserDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/registrar', userData);
      const data: AuthResponse = response.data;

      this.validateAuthResponse(data);
      return data;
    } catch (error: any) {
      if (error.response) {
        let errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;

        if (error.response.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message.join('. ');
          } else {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }

        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error(
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        );
      } else {
        throw new Error(error.message || 'Error inesperado en la petición');
      }
    }
  }

  async logout(): Promise<void> {
    try {
      const { token } = SecureStorage.getAuthData();

      if (!token) {
        return;
      }
    } catch (error: any) {
      // Silent error - logout local debe continuar
      console.error('Error during logout:', error);
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const { token } = SecureStorage.getAuthData();

      if (!token) {
        return false;
      }

      if (JWTUtils.isTokenExpired(token)) {
        return false;
      }

      const response = await apiClient.get('/auth/verify');
      return response.status === 200;
    } catch (error: any) {
      console.error('Error verifying token:', error);
      return false;
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const { token } = SecureStorage.getAuthData();

      if (!token) {
        throw new Error('No hay token para refrescar');
      }

      const response = await apiClient.post('/auth/refresh');
      const data: AuthResponse = response.data;
      this.validateAuthResponse(data);

      return data;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  async getProfile(): Promise<any> {
    try {
      const { token } = SecureStorage.getAuthData();

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  private validateAuthResponse(data: AuthResponse): void {
    if (!data.access_token) {
      throw new Error('Respuesta inválida: falta access_token');
    }

    if (!data.user) {
      throw new Error('Respuesta inválida: faltan datos de usuario');
    }

    if (!data.user.id || !data.user.email) {
      throw new Error('Respuesta inválida: datos de usuario incompletos');
    }

    if (!JWTUtils.isValidJWT(data.access_token)) {
      throw new Error('Token JWT con formato inválido');
    }

    if (JWTUtils.isTokenExpired(data.access_token)) {
      throw new Error('Token JWT expirado');
    }
  }

  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error: any) {
      console.error('Error checking server health:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
