'use client';

import { ReactNode } from 'react';
import PrivateLayout from '@/components/layouts/private-layout';
import { superAdminNavigation } from '@/lib/navigation-data';

type Props = {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <PrivateLayout navigationData={superAdminNavigation}>
      {children}
    </PrivateLayout>
  );
}
