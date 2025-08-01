// Tipos para el sistema de autenticación
import { Role } from '@/enum/role';

// Credenciales de login
export interface LoginDto {
  email: string;
  password: string;
}

// Datos de registro
export interface RegisterUserDto {
  email: string;
  password: string;
  picture?: string;
}

// Usuario autenticado
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  rut: string;
  phone?: string;
  picture?: string;
}

// Respuesta del backend al hacer login/register
export interface AuthResponse {
  status: number;
  message: string;
  access_token: string;
  user: User;
}

// Context de autenticación
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  loginWithToken: (token: string) => void; // <-- agregar esta línea
  register: (data: RegisterUserDto) => Promise<void>;
  logout: () => void; // Sin async porque no llama al backend
  isAuthenticated: boolean;
}
