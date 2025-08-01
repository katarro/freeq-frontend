'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { GoogleButton } from '@/components/ui/button-google';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormValues } from '@/lib/schemas';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Volume2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AudioActivationService } from '@/services/alarm/audio-activation.service';
import { ENV } from '@/lib/env';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [audioActivated, setAudioActivated] = useState<boolean>(false);
  const [showAudioSuccess, setShowAudioSuccess] = useState<boolean>(false);

  const { login } = useAuth();
  const { theme } = useTheme();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ✅ VERIFICAR estado de audio al cargar componente
  useEffect(() => {
    const audioInfo = AudioActivationService.getActivationInfo();
    setAudioActivated(
      audioInfo.activated && audioInfo.hoursAgo !== null && audioInfo.hoursAgo < 24,
    );
  }, []);

  // ✅ ACTIVAR audio en cualquier interacción en la página de login
  useEffect(() => {
    if (audioActivated) return;

    const activateAudioOnFirstInteraction = async () => {
      const success = await AudioActivationService.activateAudio();

      if (success) {
        setAudioActivated(true);
        setShowAudioSuccess(true);

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setShowAudioSuccess(false), 3000);
      }
    };

    // ✅ ESCUCHAR múltiples eventos
    const events = ['click', 'touchstart', 'keydown', 'mousedown', 'focus'];

    events.forEach((eventType) => {
      document.addEventListener(eventType, activateAudioOnFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, activateAudioOnFirstInteraction);
      });
    };
  }, [audioActivated]);

  async function onSubmit(values: LoginFormValues) {
    if (!values.email || !values.password) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);

    // ✅ ASEGURAR que el audio esté activado antes del login
    if (!audioActivated) {
      const success = await AudioActivationService.activateAudio();
      if (success) {
        setAudioActivated(true);
      }
    }

    try {
      await login({
        email: values.email,
        password: values.password,
      });
      toast.success('¡Inicio de sesión exitoso!');
    } catch (error: any) {
      const errorMessage = error.message || '';
      switch (true) {
        case errorMessage.includes('Credenciales'):
          toast.error('Email o contraseña incorrectos. Verifica tus datos.');
          break;
        case errorMessage.includes('conectar'):
          toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
          break;
        case errorMessage.includes('500'):
          toast.error('Error del servidor. Inténtalo nuevamente en unos minutos.');
          break;
        case errorMessage.includes('400'):
          toast.error('Error al iniciar sesión. Verifica tus datos.');
          break;
        default:
          toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
          break;
      }
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      `${ENV.API_URL}/auth/google/callback`,
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`,
    );
  };

  return (
    <Card className="w-full bg-transparent lg:max-w-md shadow-none border-none mx-auto gap-10">
      <CardHeader className="gap-0">
        <div className="flex justify-center">
          {theme === 'dark' || theme === 'system' ? (
            <Image
              src="/images/logo-white.avif"
              alt="FREEQ Logo"
              width={499}
              height={499}
              priority
              className="w-[255px] h-[128px] object-cover"
            />
          ) : (
            <Image
              src="/images/logo-freeq.avif"
              alt="FREEQ Logo"
              width={499}
              height={499}
              priority
              className="w-[255px] h-[128px] object-cover"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="grid gap-8">
        <CardTitle className="text-[22px] font-semibold text-center">
          Inicia sesión en tu cuenta
        </CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="E-mail"
                      placeholder="ej. felipe@gmail.com"
                      type="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        label="Contraseña"
                        placeholder="****************"
                        type={showPassword ? 'text' : 'password'}
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full hover:cursor-pointer" disabled={isLoading}>
              Iniciar sesión
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <span className="text-sm">
            ¿No tienes cuenta?&nbsp;
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </span>
        </div>

        {/* <div className="mx-auto text-center w-[290px] lg:w-full">
          <p className="text-sm">
            Si olvidaste tu contraseña, puedes{' '}
            <Link href="/" className="underline">
              restablecerla aquí
            </Link>
          </p>
        </div> */}
        <Separator />

        <GoogleButton
          onClick={handleGoogleLogin}
          className="w-full hover:cursor-pointer"
          type="button"
          disabled={isLoading}
        >
          Iniciar sesión con Google
        </GoogleButton>

        <Separator />
      </CardContent>
    </Card>
  );
}
