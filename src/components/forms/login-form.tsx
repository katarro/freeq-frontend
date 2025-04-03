'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormValues } from '@/lib/schemas';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { theme } = useTheme();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      // Simular autenticación exitosa
      localStorage.setItem('auth', 'true');
      router.push('/admin/home');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  console.log('theme=<', theme);

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
          Inicia sesión en tu cuenta
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
                      placeholder='ej. mateo@gmail.com'
                      type='email'
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label='Contraseña'
                      placeholder='****************'
                      type='password'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isLoading}>
              Iniciar sesión
            </Button>
          </form>
        </Form>

        <div className='mx-auto text-center w-[290px] lg:w-full'>
          <p className='text-sm'>
            Si olvidaste tu contraseña, puedes{' '}
            <a href='#' className='underline'>
              restablecerla aquí
            </a>
          </p>
        </div>
        <Separator />
        <Button className='w-full' type='button' disabled={isLoading}>
          Iniciar sesión con Google
        </Button>

        <Separator />
        <div className='text-center'>
          <span className='text-sm'>
            ¿No tienes cuenta?
            <a href='#' className='underline ml-1'>
              Regístrate
            </a>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
