import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import AdministratorForm from '@/components/forms/administrator-form';
import RuleForm from '@/components/forms/rule-form';

export default function NewRulePage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Agregar nueva regla"
        description="Completa el formulario para agregar una nueva regla al sistema."
        backItem={
          <Link
            href="/subsidiary-manager/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <RuleForm />
    </section>
  );
}
