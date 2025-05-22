import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import CompanyForm from '@/components/forms/company-form';
import type { CompanyValues } from '@/lib/schemas';

const exampleInitialData: CompanyValues = {

  name: 'Empresa Ejemplo S.A.',
  rut: '12.345.678-9',
  subsidiaries: 10,
  administrators: 3,
  users: 150,
  state: 'Activo',
};

export default function EditCompanyPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Editar empresa"
        description="Completa el formulario para editar la información de la empresa."
        backItem={
          <Link
            href="/super-admin/companies/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <CompanyForm isEditing={true} initialData={exampleInitialData}/>
    </section>
  );
}
