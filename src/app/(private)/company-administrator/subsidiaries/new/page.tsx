import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import SubsidiaryForm from '@/components/forms/subsidiary-form';

export default function NewSubsidiaryPage() {
  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nueva sucursal"
        description="Completa el formulario para agregar una nueva sucursal al sistema."
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
      <SubsidiaryForm/>
    </section>
  );
}
