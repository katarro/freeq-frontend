import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import SubsidiaryManagerForm from '@/components/forms/subsidiary-manager-form';

export default function NewSubsidiaryManagerPage() {
  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nuevo Jefe de Sucursal"
        description="Completa el formulario para agregar un nuevo jefe de sucursal al sistema."
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
      <SubsidiaryManagerForm />
    </section>
  );
}
