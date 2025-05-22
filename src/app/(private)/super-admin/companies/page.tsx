import CompaniesTable from '@/app/(private)/super-admin/companies/_components/companies-table';
import { data } from './data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';

export default function CompaniesPage() {
  return (
    <>
      <section className="grid gap-6 pb-[calc(56px+16px)]">
        <Heading
          title="Gestión de empresas"
          right={
            <Link
              href="/super-admin/companies/new"
              aria-label="Agregar empresa"
              className={cn(buttonVariants({ variant: 'default' }),'hidden lg:flex')}
            >
              <Plus/>
              Agregar empresa
            </Link>
          }
        />
        <Separator />
        <div className="">
          <CompaniesTable data={data} />
        </div>
      </section>
      <Link
        href="/super-admin/companies/new"
        aria-label="Agregar empresa"
        className={cn(buttonVariants({  variant: 'fab', size: 'fab' }),'fixed bottom-[calc(55px+16px)] right-4 lg:hidden')}
      >
        <Plus/>
        Añadir empresa
      </Link>
    </>
  );
}
