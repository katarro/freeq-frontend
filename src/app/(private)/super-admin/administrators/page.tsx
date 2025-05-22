import { data } from './data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import AdministratorTable from '@/app/(private)/super-admin/administrators/_components/administrators-table';

export default function AdministratorsPage() {
  return (
    <>
      <section className="grid gap-6 pb-[calc(56px+16px)]">
        <Heading
          title="Gestión de administradores"
          right={
            <Link
              href="/super-admin/administrators/new"
              aria-label="Agregar administrador"
              className={cn(buttonVariants({ variant: 'default' }),'hidden lg:flex')}
            >
              <Plus/>
              Agregar administrador
            </Link>
          }
        />
        <Separator />
        <div className="">
          <AdministratorTable data={data} />
        </div>
      </section>
      <Link
        href="/super-admin/administrators/new"
        aria-label="Agregar administrador"
        className={cn(buttonVariants({  variant: 'fab', size: 'fab' }),'fixed bottom-[calc(55px+16px)] right-4 lg:hidden')}
      >
        <Plus/>
        Añadir administrador
      </Link>
    </>
  );
}
