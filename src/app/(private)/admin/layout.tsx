'use client';

import { ReactNode } from 'react';
import PrivateLayout from '@/components/layouts/private-layout';
import { clientNavigation } from '@/lib/navigation-data';

export default function AdminLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <PrivateLayout navigationData={clientNavigation}>
      {children}
    </PrivateLayout>
  );
}
