'use client';

import { ReactNode } from 'react';
import PrivateLayout from '@/components/layouts/private-layout';
import { operatorNavigation } from '@/lib/navigation-data';
import OperatorProvider from '@/contexts/OperatorContext';

type OperatorLayoutProps = {
  children: ReactNode;
};

export default function OperatorLayout({ children }: OperatorLayoutProps) {
  return (
    <PrivateLayout navigationData={operatorNavigation}>
      <OperatorProvider>{children}</OperatorProvider>
    </PrivateLayout>
  );
}
