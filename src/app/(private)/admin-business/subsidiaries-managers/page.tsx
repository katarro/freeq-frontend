import { data } from './data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import SubsidiaryManagersTable from './_components/subsidiary-managers-table';

export default function SubsidiaryManagersPage() {
  return (
    <>
      <section className="grid gap-6 pb-[calc(56px+16px)]">
        <Heading
          title="Gestión de jefes de sucursal"
          right={
            <Link
              href="/company-administrator/subsidiaries-managers/new"
              aria-label="Agregar jefe de sucursal"
              className={cn(buttonVariants({ variant: 'default' }), 'hidden lg:flex')}
            >
              <Plus />
              Agregar Jefe
            </Link>
          }
        />
        <Separator />
        <div className="">
          <SubsidiaryManagersTable data={data} />
        </div>
      </section>
      <Link
        href="/company-administrator/subsidiaries-managers/new"
        aria-label="Agregar jefe de sucursal"
        className={cn(buttonVariants({ variant: 'fab', size: 'fab' }), 'fixed bottom-[calc(55px+16px)] right-4 lg:hidden')}
      >
        <Plus />
        Añadir Jefe
      </Link>
    </>
  );
}
