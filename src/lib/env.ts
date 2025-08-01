// lib/env.ts

// Configuración centralizada sin validaciones complejas
export const ENV = {
  // API URLs dinámicas basadas en el modo
  API_URL:
    process.env.NEXT_PUBLIC_MODE === 'production'
      ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
      : process.env.NEXT_PUBLIC_API_URL_DEVELOP,

  // Modo actual
  MODE: process.env.NEXT_PUBLIC_MODE as 'development' | 'production',

  // Clave de encriptación
  ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY,

  // Configuración de cookies dinámica
  COOKIE: {
    DOMAIN:
      process.env.NEXT_PUBLIC_MODE === 'production'
        ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN_PRODUCTION || 'freeq.cl'
        : process.env.NEXT_PUBLIC_COOKIE_DOMAIN_DEVELOP || 'localhost',

    SECURE:
      process.env.NEXT_PUBLIC_MODE === 'production'
        ? (process.env.NEXT_PUBLIC_COOKIE_SECURE_PRODUCTION || 'true') === 'true'
        : (process.env.NEXT_PUBLIC_COOKIE_SECURE_DEVELOP || 'false') === 'true',
  },

  // Información del entorno
  IS_DEVELOPMENT: process.env.NEXT_PUBLIC_MODE === 'development',
  IS_PRODUCTION: process.env.NEXT_PUBLIC_MODE === 'production',
} as const;

// Tipos para TypeScript
export type EnvMode = typeof ENV.MODE;
export type EnvConfig = typeof ENV;
