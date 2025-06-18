import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import type { SubsidiaryValues } from '@/lib/schemas/subsidiary-schema';
import SubsidiaryForm from '@/components/forms/subsidiary-form';

const exampleInitialData: SubsidiaryValues = {
  id: 1,
  name: 'Santiago Centro',
  address: 'Alameda 1340, Santiago',
  branchManager: 'Roberto Sánchez',
  executives: 12,
  status: 'Activo',
};

export default function EditSubsidiaryPage() {
  return (
    <section className="grid gap-6">
      <Heading
        title="Editar sucursal"
        description="Completa el formulario para editar la información de la sucursal."
        backItem={
          <Link
            href="/company-administrator/subsidiaries/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <SubsidiaryForm isEditing={true} initialData={exampleInitialData}/>
    </section>
  );
}
