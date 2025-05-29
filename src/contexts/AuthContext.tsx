'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { AuthContextType, LoginDto, RegisterUserDto, User } from '@/types/auth';
import { Role } from '@/enum/role';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_ROUTES: Record<Role, string> = {
  [Role.CLIENT]: '/user/home',
  [Role.EXECUTIVE]: '/executive/dashboard',
  [Role.ADMIN_BRANCH]: '/admin-branch/dashboard',
  [Role.ADMIN_BUSINESS]: '/admin-business/dashboard',
  [Role.ADMIN]: '/admin/dashboard',
};

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginDto): Promise<void> => {
    try {
      setLoading(true);

      const response = await authService.login(credentials);

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);

      const redirectPath = ROLE_ROUTES[response.user.role] || '/user/home';
      router.push(redirectPath);

      console.log('✅ Login exitoso:', response.user.email);
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterUserDto): Promise<void> => {
    try {
      setLoading(true);

      const response = await authService.register(userData);

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);

      const redirectPath = ROLE_ROUTES[response.user.role] || '/user/home';
      router.push(redirectPath);

      console.log('✅ Registro exitoso:', response.user.email);
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback((): void => {
    try {
      setLoading(true);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setUser(null);

      router.push('/login');

      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const value: AuthContextType = React.useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}
