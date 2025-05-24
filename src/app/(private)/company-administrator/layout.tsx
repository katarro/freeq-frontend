'use client';

import { ReactNode } from 'react';
import PrivateLayout from '@/components/layouts/private-layout';
import { companyAdministratorNavigation } from '@/lib/navigation-data';

type Props = {
  children: ReactNode;
}

export default function CompanyAdministratorLayout({ children }: Props) {
  return (
    <PrivateLayout navigationData={companyAdministratorNavigation}>
      {children}
    </PrivateLayout>
  );
}
