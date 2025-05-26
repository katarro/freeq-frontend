import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import { BoxFormValues } from '@/lib/schemas';
import BoxForm from '@/components/forms/box-form';

const exampleEditedPhysicalBoxData: BoxFormValues = {
  id: 'edit-phy-001',
  name: 'Caja Principal - Sector A Editada',
  type: 'physical',
  location: 'Primer Piso - Al lado de la entrada',
  capacity: 25,
  equipment: ['Terminal POS', 'Impresora', 'Cámara'],
  priority: 'Muy Alta',
  assignedOperator: 'maria',
  services: ['Depósitos', 'Retiros', 'Pago de facturas', 'Consultas de saldo'],
  status: 'Activa',
  currentQueue: 1,
  avgWaitTime: '0:02',
};
export default function EditCompanyPage() {

  return (
    <section className="grid gap-6">
      <Heading
        title="Editar caja"
        description="Completa el formulario para editar la información de la caja."
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
      <BoxForm isEditing={true} initialData={exampleEditedPhysicalBoxData}/>
    </section>
  );
}
