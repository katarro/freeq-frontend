'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { GoogleButton } from '@/components/ui/button-google';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormValues } from '@/lib/schemas';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Importar iconos

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // 👈 Estado para mostrar/ocultar contraseña
  const { login } = useAuth();
  const { theme } = useTheme();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error(error);
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
      <CardContent className='grid gap-8'>
        <CardTitle className='text-[22px] font-semibold text-center'>
          Inicia sesión en tu cuenta <br />- Testing -
        </CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label='E-mail'
                      placeholder='ej. felipe@gmail.com'
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

            <Button
              type='submit'
              className='w-full hover:cursor-pointer'
              disabled={isLoading}
            >
              Iniciar sesión
            </Button>
          </form>
        </Form>

        <div className='mx-auto text-center w-[290px] lg:w-full'>
          <p className='text-sm'>
            Si olvidaste tu contraseña, puedes{' '}
            <Link href='/' className='underline'>
              restablecerla aquí
            </Link>
          </p>
        </div>
        <Separator />

        <GoogleButton
          className='w-full hover:cursor-pointer'
          type='button'
          disabled={isLoading}
        >
          Iniciar sesión con Google
        </GoogleButton>

        <Separator />
        <div className='text-center'>
          <span className='text-sm'>
            ¿No tienes cuenta?&nbsp;
            <Link href='/register' className='underline'>
              Regístrate
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
