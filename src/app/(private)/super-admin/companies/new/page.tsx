import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import CompanyForm from '@/components/forms/company-form';

export default function NewCompanyPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nueva empresa"
        description="Completa el formulario para agregar una nueva empresa al sistema."
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
      <CompanyForm/>
    </section>
  );
}
