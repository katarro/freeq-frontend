// lib/auth.ts
import { LoginDto, RegisterUserDto, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class AuthService {
  private readonly baseUrl = API_URL;

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error;
    }
  }

  /**
   * Registrar usuario
   */
  async register(userData: RegisterUserDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en authService.register:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión (opcional - si tu backend lo requiere)
   */
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Limpiar datos locales
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error en authService.logout:', error);
      // Aunque falle el backend, limpiar datos locales
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Verificar si el token es válido
   */
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');

      if (!token) return false;

      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  }
}

// Exportar una instancia única del servicio
export const authService = new AuthService();
