import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import OperatorForm from '@/components/forms/operator-form';
import { OperatorValues } from '@/lib/schemas';

const exampleInitialOperatorData: Partial<OperatorValues> = {
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  phone: '56 9 1122 3344',
  shift: 'Mixto',
  branch: 'Oriente',
  startDate: '2024-04-15',
};

export default function EditCompanyPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Editar operador"
        description="Completa el formulario para editar la información del operador."
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
      <OperatorForm isEditing={true} initialData={exampleInitialOperatorData}/>
    </section>
  );
}
