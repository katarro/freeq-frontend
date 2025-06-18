'use client';

import { ReactNode } from 'react';
import PrivateLayout from '@/components/layouts/private-layout';
import { subsidiaryManagerNavigation } from '@/lib/navigation-data';

type Props = {
  children: ReactNode;
}

export default function SubsidiaryManagerLayout({ children }: Props) {
  return (
    <PrivateLayout navigationData={subsidiaryManagerNavigation}>
      {children}
    </PrivateLayout>
  );
}
