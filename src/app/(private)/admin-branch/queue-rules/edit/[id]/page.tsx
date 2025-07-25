import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import type { RuleValues } from '@/lib/schemas';
import RuleForm from '@/components/forms/rule-form';

const exampleInitialData: RuleValues = {
  id: '1',
  name: 'Tiempo Máximo de Atención (Editado)',
  description: 'Tiempo límite para atender un cliente antes de escalar.',
  value: '7',
  unit: 'minutos',
  type: 'time',
  status: 'Activa',
  priority: 'Muy Alta',
  actions: ['Alerta al supervisor', 'Notificación al operador', 'Escalar problema'],
};
export default function EditRulePage() {
  return (
    <section className="grid gap-6">
      <Heading
        title="Editar regla"
        description="Completa el formulario para editar la información de la regla."
        backItem={
          <Link
            href="/admin-branch/queue-rules/"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <RuleForm isEditing={true} initialData={exampleInitialData} />
    </section>
  );
}
