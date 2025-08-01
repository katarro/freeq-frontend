'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // para Next.js 13 app router
import { useAuth } from '@/contexts/AuthContext';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      loginWithToken(token);
      router.replace('/user/home'); // o donde quieras redirigir
    } else {
      // Si no hay token, redirige a login
      router.replace('/login');
    }
  }, [searchParams, loginWithToken, router]);

  return <div>Iniciando sesión con Google...</div>;
}
