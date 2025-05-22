import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import AdministratorForm from '@/components/forms/administrator-form';

export default function NewAdministratorPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nuevo administrador"
        description="Completa el formulario para agregar un nuevo administrador al sistema."
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
      <AdministratorForm/>
    </section>
  );
}
