'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas';
import { Separator } from '@/components/ui/separator';
import { GoogleButton } from '../ui/button-google';
import { useAuth } from '@/contexts/AuthContext';
import AlertBox from '../ui/alert-box';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Importar iconos
import { toast } from 'sonner';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  // 👈 Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { theme } = useTheme();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Función para validar contraseñas en tiempo real
  const validatePasswords = () => {
    const password = form.getValues('password');
    const confirmPassword = form.getValues('confirmPassword');

    // Solo validar si ambos campos tienen contenido
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(null); // Reset si algún campo está vacío
    }
  };

  // Efecto para validar cuando cambian los valores
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'password' || name === 'confirmPassword') {
        validatePasswords();
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      if (values.password !== values.confirmPassword) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: 'Las contraseñas no coinciden',
        });
        return;
      }

      await register({
        email: values.email,
        password: values.password,
      });

      toast.success('¡Registro exitoso! Redirigiendo...');
    } catch (error: any) {
      console.error('Error completo en registro:', error);

      // Mostrar el mensaje específico del backend
      let errorMessage = 'Error al registrar usuario';

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Mapear errores comunes a mensajes más amigables
      if (errorMessage.includes('Usuario ya existe')) {
        errorMessage =
          'Ya existe una cuenta con este email. ¿Quizás quieres iniciar sesión?';
      } else if (errorMessage.includes('password is not strong enough')) {
        errorMessage =
          'La contraseña no cumple con los requisitos de seguridad.';
      } else if (errorMessage.includes('email must be an email')) {
        errorMessage = 'Por favor ingresa un email válido.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='w-full bg-transparent lg:max-w-md shadow-none border-none mx-auto gap-10'>
      <CardHeader className='gap-0'>
        <div className='flex justify-center'>
          {theme === 'dark' || theme === 'system' ? (
            <Image
              src='/images/logo-white.avif'
              alt='FREEQ Logo'
              width={499}
              height={499}
              priority
              className='w-[255px] h-[128px] object-cover'
            />
          ) : (
            <Image
              src='/images/logo-freeq.avif'
              alt='FREEQ Logo'
              width={499}
              height={499}
              priority
              className='w-[255px] h-[128px] object-cover'
            />
          )}
        </div>
      </CardHeader>

      {/* Mostrar alertas */}
      <AlertBox type='error' message={error} onClose={() => setError('')} />

      <AlertBox
        type='success'
        message={success}
        onClose={() => setSuccess('')}
      />

      <CardContent className='grid gap-8'>
        <CardTitle className='text-[22px] font-semibold text-center'>
          Crea tu cuenta <br />- Testing -
        </CardTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'></div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label='E-mail'
                      placeholder='ej. juan.perez@gmail.com'
                      type='email'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 👈 Campo de contraseña con toggle */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        label='Contraseña'
                        placeholder='****************'
                        type={showPassword ? 'text' : 'password'} // 👈 Cambiar tipo dinámicamente
                        disabled={isLoading}
                        {...field}
                      />
                      {/* 👈 Botón para toggle contraseña */}
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1} // Evitar que reciba foco con Tab
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 👈 Campo de confirmar contraseña con toggle y validación */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        label='Confirmar contraseña'
                        placeholder='****************'
                        type={showConfirmPassword ? 'text' : 'password'} // 👈 Cambiar tipo dinámicamente
                        disabled={isLoading}
                        className={cn(
                          // Aplicar estilos según el estado de validación
                          passwordsMatch === false &&
                            'border-red-500 focus-visible:ring-red-500',
                          passwordsMatch === true &&
                            'border-green-500 focus-visible:ring-green-500',
                        )}
                        {...field}
                      />

                      {/* 👈 Contenedor para iconos */}
                      <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2'>
                        {/* Indicador de validación */}
                        {passwordsMatch !== null && (
                          <div>
                            {passwordsMatch ? (
                              <span className='text-green-500 text-sm'>✓</span>
                            ) : (
                              <span className='text-red-500 text-sm'>✕</span>
                            )}
                          </div>
                        )}

                        {/* Botón para toggle contraseña */}
                        <button
                          type='button'
                          className='text-gray-500 hover:text-gray-700 transition-colors'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                    </div>
                  </FormControl>

                  {/* Mensaje de validación en tiempo real */}
                  {passwordsMatch === false && (
                    <p className='text-sm text-red-500 mt-1'>
                      Las contraseñas no coinciden
                    </p>
                  )}
                  {passwordsMatch === true && (
                    <p className='text-sm text-green-500 mt-1'>
                      Las contraseñas coinciden
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full hover:cursor-pointer'
              disabled={isLoading || passwordsMatch === false}
            >
              Crear cuenta
            </Button>
          </form>
        </Form>

        <div className='mx-auto text-center w-[290px] lg:w-full'>
          <p className='text-xs text-muted-foreground'>
            Al registrarte, aceptas nuestros{' '}
            <Link href='/terms' className='underline'>
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link href='/privacy' className='underline'>
              Política de Privacidad
            </Link>
          </p>
        </div>

        <Separator />

        <GoogleButton
          className='w-full hover:cursor-pointer'
          type='button'
          disabled={isLoading}
        >
          Registrarse con Google
        </GoogleButton>

        <Separator />

        <div className='text-center'>
          <span className='text-sm'>
            ¿Ya tienes cuenta?&nbsp;
            <Link href='/login' className='underline'>
              Inicia sesión
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
