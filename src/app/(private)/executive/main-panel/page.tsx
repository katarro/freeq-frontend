'use client';

import Heading from '@/components/heading';
import { AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import {
  ControlPanel,
  StatusCards,
  AttendanceHistoryTable,
} from '@/components/executive/main-panel';
import { useOperatorContext } from '@/contexts/OperatorContext';
import AuthLoadingScreen from '@/components/auth/auth-loading-screen';
import { useAuthPageAnimation } from '@/hooks/use-auth-page-animation';

export default function MainPanelPage() {
  const { loading, setShowForm } = useAuthPageAnimation();
  const { isLoaded } = useOperatorContext();

  if (!isLoaded) {
    return (
      <section className='grid gap-4'>
        <div className='flex items-center justify-center p-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Restaurando estado del operador...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='grid gap-4'>
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

      <Heading title='Panel operador' />
      <Separator />

      <StatusCards />

      <div className='grid gap-4 md:grid-cols-1'>
        <ControlPanel />
      </div>

      <AttendanceHistoryTable />
    </section>
  );
}
