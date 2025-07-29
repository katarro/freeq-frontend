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
import React from 'react';

// Memorizar componentes estáticos
const MemoizedHeading = React.memo(() => <Heading title="Panel operador" />);
const MemoizedSeparator = React.memo(() => <Separator />);
const MemoizedStatusCards = React.memo(StatusCards);
const MemoizedControlPanel = React.memo(ControlPanel);

// Memorizar la tabla pero permitir que reciba flowStep como prop
const MemoizedAttendanceHistoryTable = React.memo(({ flowStep }: { flowStep: string }) => (
  <AttendanceHistoryTable flowStep={flowStep} />
));

export default function MainPanelPage() {
  // ✅ OPTIMIZACIÓN: Solo loggear en desarrollo y con throttling
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 MainPanelPage se renderizó');
  }

  const { loading, setShowForm } = useAuthPageAnimation();
  const { isLoaded, flowStep } = useOperatorContext();

  // ✅ OPTIMIZACIÓN: Solo re-renderizar cuando cambien valores críticos
  const memoizedFlowStep = React.useMemo(() => flowStep, [flowStep]);
  const memoizedIsLoaded = React.useMemo(() => isLoaded, [isLoaded]);

  if (!memoizedIsLoaded) {
    return (
      <section className="grid gap-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Restaurando estado del operador...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
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

      <MemoizedHeading />
      <MemoizedSeparator />
      <MemoizedStatusCards />

      <div className="grid gap-4 md:grid-cols-1">
        <MemoizedControlPanel />
      </div>

      <MemoizedAttendanceHistoryTable flowStep={memoizedFlowStep} />
    </section>
  );
}
