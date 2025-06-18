import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import SurveyForm from '@/components/forms/survey-form';
import type { SurveyFormValues } from '@/lib/schemas';

const exampleInitialData: SurveyFormValues = {
  id: 'survey-123',
  title: 'Encuesta de Satisfacción del Cliente (Edición)',
  description: 'Esta es una encuesta de ejemplo para probar la funcionalidad de edición.',
  startDate: '2025-05-01',
  endDate: '2025-05-31',
  status: 'Activa',
  responses: 500,
  satisfaction: 85,
  questions: [
    { id: 'q-abc', text: '¿Cómo calificaría la calidad de nuestro servicio?', type: 'rating' },
    {
      id: 'q-def',
      text: '¿Cuál de las siguientes opciones describe mejor su experiencia con nuestro soporte?',
      type: 'multiple',
      options: ['Excelente', 'Buena', 'Regular', 'Mala'],
    },
    { id: 'q-ghi', text: '¿Tiene alguna sugerencia para mejorar?', type: 'text' },
  ],
};

export default function EditSurveyPage() {
  return (
    <section className="grid gap-6 w-full">
      <Heading
        title="Editar encuesta"
        description="Modifica la información de la encuesta existente."
        backItem={
          <Link
            href="/company-administrator/surveys"
            className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'w-fit')}
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />
      <Separator />
      <SurveyForm initialData={exampleInitialData} isEditing={true} />
    </section>
  );
}
