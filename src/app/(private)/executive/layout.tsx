'use client';

import { ReactNode } from 'react';
import PrivateLayout from '@/components/layouts/private-layout';
import { operatorNavigation } from '@/lib/navigation-data';

type Props = {
  children: ReactNode;
};

export default function OperatorLayout({ children }: Props) {
  return (
    <PrivateLayout navigationData={operatorNavigation}>
      {children}
    </PrivateLayout>
  );
}
