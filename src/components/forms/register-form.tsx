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
import { registerSchema, type RegisterFormValues } from '@/lib/schemas';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { GoogleButton } from '../ui/button-google';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { theme } = useTheme();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    try {
      // Simular registro exitoso
      console.warn(values);
      localStorage.setItem('auth', 'true');
      router.push('/admin/home');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  console.warn('theme=<', theme);

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
          Crea tu cuenta <br />- Testing -
        </CardTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label='Nombre'
                        placeholder='ej. Juan'
                        type='text'
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
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label='Apellido'
                        placeholder='ej. Pérez'
                        type='text'
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label='Confirmar contraseña'
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
            <Button
              type='submit'
              className='w-full hover:cursor-pointer'
              disabled={isLoading}
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
