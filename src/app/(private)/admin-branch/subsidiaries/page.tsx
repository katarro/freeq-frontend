import { data } from './data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import SubsidiaryTable from './_components/subsidiaries-table';

export default function SubsidiariesPage() {
  return (
    <>
      <section className="grid gap-6 pb-[calc(56px+16px)]">
        <Heading
          title="Gestión de sucursales"
          right={
            <Link
              href="/company-administrator/subsidiaries/new"
              aria-label="Agregar sucursal"
              className={cn(buttonVariants({ variant: 'default' }),'hidden lg:flex')}
            >
              <Plus/>
              Agregar sucursal
            </Link>
          }
        />
        <Separator />
        <div className="">
          <SubsidiaryTable data={data} />
        </div>
      </section>
      <Link
        href="/super-admin/subsidiaries/new"
        aria-label="Agregar sucursal"
        className={cn(buttonVariants({  variant: 'fab', size: 'fab' }),'fixed bottom-[calc(55px+16px)] right-4 lg:hidden')}
      >
        <Plus/>
        Añadir sucursal
      </Link>
    </>
  );
}
