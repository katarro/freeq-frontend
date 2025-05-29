export const API_URL =
  process.env.NEXT_PUBLIC_MODE === 'development'
    ? process.env.NEXT_PUBLIC_API_URL_DEVELOP
    : process.env.NEXT_PUBLIC_API_URL_PRODUCTION;
