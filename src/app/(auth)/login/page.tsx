'use client';

import LoginForm from '@/components/forms/login-form';
import Image from 'next/image';
import { useAuthPageAnimation } from '@/hooks/use-auth-page-animation';

import { motion } from 'framer-motion';

export default function LoginPage() {
  const { loading, showForm } = useAuthPageAnimation();

  return (
    <div className='relative overflow-hidden min-h-screen w-full'>
      <motion.main
        key='content'
        className='min-h-screen w-full bg-background fixed inset-0 overflow-y-auto'
        initial={{ y: '100vh' }}
        animate={{
          y: loading ? '100vh' : 0,
          transition: {
            duration: 0.8,
            ease: 'easeOut',
            delay: loading ? 999 : 0,
          },
        }}
      >
        <div className='flex flex-col min-h-screen'>
          <Image
            src='/images/banner.avif'
            alt='FREEQ Logo'
            width={499}
            height={10}
            priority
            className='w-full h-3'
          />
          <motion.div
            className='flex-1 overflow-y-auto'
            initial={{ opacity: 0 }}
            animate={{
              opacity: showForm ? 1 : 0,
              transition: {
                duration: 0.5,
              },
            }}
          >
            {showForm && <LoginForm />}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
