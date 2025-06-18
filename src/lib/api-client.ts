import axios, { AxiosResponse, AxiosError } from 'axios';
import { ENV } from '@/lib/env';

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      let token = null;

      const encryptedToken = localStorage.getItem('token');
      if (encryptedToken) {
        try {
          if (typeof window !== 'undefined' && (window as any).SecureStorage) {
            token = (window as any).SecureStorage.getItem('token', true);
          }
        } catch (error) {
          console.error('Error al obtener token encriptado:', error);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error en interceptor de solicitud:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || 'Request error'));
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        if (typeof window !== 'undefined' && (window as any).SecureStorage) {
          (window as any).SecureStorage.clearAuthData();
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (cleanupError) {
        console.error('Error al limpiar datos de autenticación:', cleanupError);
      }

      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }

    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        const networkError = new Error(
          'No se puede conectar al servidor. Verifica que el backend esté corriendo.',
        );
        return Promise.reject(networkError);
      } else {
        const connectionError = new Error(
          'Error de conexión. Verifica tu conexión a internet.',
        );
        return Promise.reject(connectionError);
      }
    }

    return Promise.reject(error);
  },
);

if (typeof window !== 'undefined') {
  import('@/lib/secure-storage')
    .then(({ SecureStorage }) => {
      (window as any).SecureStorage = SecureStorage;
    })
    .catch((error) => {
      console.error('Error al cargar SecureStorage:', error);
    });
}

export default apiClient;
