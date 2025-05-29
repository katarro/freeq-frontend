'use client';

import RegisterForm from '@/components/forms/register-form';
import AuthLoadingScreen from '@/components/auth/auth-loading-screen';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthPageAnimation } from '@/hooks/use-auth-page-animation';

export default function RegisterPage() {
  const { loading, showForm, setShowForm } = useAuthPageAnimation();

  return (
    <div className='relative overflow-hidden min-h-screen w-full'>
      <AnimatePresence>
        {loading && (
          <AuthLoadingScreen
            onAnimationStart={() => {
              if (!loading) {
                setShowForm(true);
              }
            }}
          />
        )}
      </AnimatePresence>

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
                delay: 0.3,
                duration: 0.5,
              },
            }}
          >
            {showForm && <RegisterForm />}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
