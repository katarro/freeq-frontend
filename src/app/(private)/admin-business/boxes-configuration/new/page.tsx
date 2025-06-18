import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import BoxForm from '@/components/forms/box-form';

export default function NewBoxPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nueva caja"
        description="Completa el formulario para agregar una nueva caja al sistema."
        backItem={
          <Link
            href="/subsidiary-manager/boxes-configuration/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <BoxForm />
    </section>
  );
}
