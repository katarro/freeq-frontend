'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import FreeqSidebar from '@/components/freeq-sidebar';
import FreeqHeader from '@/components/freeq-header';
import FreeqNavigationBar from '@/components/freeq-navigation-bar';
import { ReactNode, Suspense } from 'react';
import { NavigationGroup } from '@/lib/navigation-data';

type Props = {
  children: ReactNode;
  navigationData?: NavigationGroup[];
}

export default function PrivateLayout({ children, navigationData = [] }:Props) {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center h-screen'>
          Cargando...
        </div>
      }
    >
      <div className='flex h-screen flex-col lg:flex-row'>
        <SidebarProvider>
          <FreeqSidebar navigationData={navigationData}/>
          <SidebarInset className='relative'>
            <FreeqHeader />
            <main className='lg:p-8 pt-4 px-4 flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden pb-[calc(55px+16px)]'>
              {children}
            </main>
            <FreeqNavigationBar />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </Suspense>
  );
}
