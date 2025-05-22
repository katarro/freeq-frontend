import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import type { AdministratorValues } from '@/lib/schemas';
import AdministratorForm from '@/components/forms/administrator-form';

const exampleInitialData: AdministratorValues = {
  id: 1,
  name: 'Carlos Rodríguez',
  email: 'carlos@bancoestado.cl',
  company: 'Banco Estado',
};

export default function EditCompanyPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Editar administrator"
        description="Completa el formulario para editar la información del administrador."
        backItem={
          <Link
            href="/super-admin/administrators/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <AdministratorForm isEditing={true} initialData={exampleInitialData}/>
    </section>
  );
}
