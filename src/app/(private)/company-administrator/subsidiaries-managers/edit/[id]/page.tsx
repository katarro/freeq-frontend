import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import type { SubsidiaryManagerValues } from '@/lib/schemas';
import SubsidiaryManagerForm from '@/components/forms/subsidiary-manager-form';

const exampleInitialData: SubsidiaryManagerValues = {
  id: 1,
  fullName: 'Juanita Pérez',
  email: 'juanita.perez@example.com',
  phone: '+56912345678',
  subsidiary: 'Santiago Centro',
  status: 'Activo',
};

export default function EditSubsidiaryManagerPage() {
  return (
    <section className="grid gap-6">
      <Heading
        title="Editar Jefe de Sucursal"
        description="Completa el formulario para editar la información del jefe de sucursal."
        backItem={
          <Link
            href="/company-administrator/subsidiaries-manganers/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <SubsidiaryManagerForm isEditing={true} initialData={exampleInitialData} />
    </section>
  );
}
