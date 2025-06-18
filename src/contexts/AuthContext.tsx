'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/AuthService';
import { AuthContextType, LoginDto, RegisterUserDto, User } from '@/types/auth';
import { Role } from '@/enum/role';
import { SecureStorage } from '@/lib/secure-storage';
import { JWTUtils } from '@/lib/encryption';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_ROUTES: Record<Role, string> = {
  [Role.CLIENT]: '/user/home',
  [Role.EXECUTIVE]: '/executive/main-panel',
  [Role.ADMIN_BRANCH]: '/admin-branch/kpis',
  [Role.ADMIN_BUSINESS]: '/admin-business/main-panel',
  [Role.ADMIN]: '/admin/dashboard',
};

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  function getRoleName(role: any): string {
    if (typeof role === 'string') {
      return role;
    }
    if (typeof role === 'object' && role?.name) {
      return role.name;
    }
    return 'CLIENT';
  }

  const validateAndCleanData = useCallback(() => {
    try {
      if (!SecureStorage) {
        return null;
      }

      const { token, user: userData } = SecureStorage.getAuthData();

      if (token && userData) {
        if (!JWTUtils.isValidJWT(token)) {
          SecureStorage.clearAuthData();
          return null;
        }

        if (JWTUtils.isTokenExpired(token)) {
          SecureStorage.clearAuthData();
          return null;
        }

        if (!userData.id || !userData.role) {
          SecureStorage.clearAuthData();
          return null;
        }

        return { token, user: userData };
      }

      return null;
    } catch (error) {
      console.error(
        'Error al validar y limpiar datos de autenticación:',
        error,
      );
      if (SecureStorage) {
        SecureStorage.clearAuthData();
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!SecureStorage) {
          setUser(null);
          setLoading(false);
          setIsInitialized(true);
          return;
        }

        try {
          SecureStorage.migrateUnencryptedData();
        } catch (error) {
          console.error('Error migrando datos no encriptados:', error);
        }

        const authData = validateAndCleanData();

        if (authData) {
          setUser(authData.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        if (SecureStorage) {
          SecureStorage.clearAuthData();
        }
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, validateAndCleanData]);

  useEffect(() => {
    if (!isInitialized || loading) return;

    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : '';

    if (
      user &&
      (currentPath === '/login' ||
        currentPath === '/register' ||
        currentPath === '/')
    ) {
      const roleName = getRoleName(user.role);
      const redirectPath = ROLE_ROUTES[roleName as Role] || '/user/home';

      setTimeout(() => {
        router.replace(redirectPath);
      }, 100);

      return;
    }

    const isProtectedRoute = [
      '/user',
      '/executive',
      '/admin-branch',
      '/admin-business',
      '/admin',
    ].some((route) => currentPath.startsWith(route));

    if (!user && isProtectedRoute) {
      router.replace('/login');
    }
  }, [user, isInitialized, loading, router]);

  useEffect(() => {
    if (!user || !isInitialized || !SecureStorage) return;

    const checkTokenValidity = () => {
      try {
        const { token } = SecureStorage.getAuthData();

        if (!token || JWTUtils.isTokenExpired(token)) {
          if (SecureStorage) {
            SecureStorage.clearAuthData();
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar validez del token:', error);
        if (SecureStorage) {
          SecureStorage.clearAuthData();
        }
        setUser(null);
      }
    };

    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, isInitialized]);

  const login = async (credentials: LoginDto): Promise<void> => {
    try {
      setLoading(true);

      const response = await authService.login(credentials);

      if (!response.access_token || !response.user) {
        throw new Error('Respuesta de login inválida');
      }

      if (!SecureStorage) {
        throw new Error('SecureStorage no disponible');
      }

      SecureStorage.setAuthData(response.access_token, response.user);
      setUser(response.user);
    } catch (error) {
      if (SecureStorage) {
        SecureStorage.clearAuthData();
      }
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterUserDto): Promise<void> => {
    try {
      setLoading(true);

      const response = await authService.register(userData);

      if (!response.access_token || !response.user) {
        throw new Error('Respuesta de registro inválida');
      }

      if (!SecureStorage) {
        throw new Error('SecureStorage no disponible');
      }

      SecureStorage.setAuthData(response.access_token, response.user);
      setUser(response.user);
    } catch (error) {
      if (SecureStorage) {
        SecureStorage.clearAuthData();
      }
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Sin notificación al servidor para evitar error 404
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      if (SecureStorage) {
        SecureStorage.clearAuthData();
      }
      setUser(null);
      router.replace('/login');
    }
  }, [router]);

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!SecureStorage) {
      setUser(null);
      return;
    }

    const authData = validateAndCleanData();
    if (authData) {
      setUser(authData.user);
    } else {
      setUser(null);
    }
  }, [validateAndCleanData]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading, logout, refreshUser],
  );

  if (!isInitialized) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-background'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}
