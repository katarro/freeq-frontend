import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import OperatorForm from '@/components/forms/operator-form';

export default function NewOperatorPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nuevo ejecutivo"
        description="Completa el formulario para agregar un nuevo ejecutivo al sistema."
        backItem={
          <Link
            href="/subsidiary-manager/operators/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <OperatorForm />
    </section>
  );
}
