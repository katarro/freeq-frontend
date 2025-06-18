import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import SurveyForm from '@/components/forms/survey-form';

export default function NewSurveyPage() {
  return (
    <section className="grid gap-6 w-full">
      <Heading
        title="Crear encuesta"
        backItem={
          <Button variant="outline" size="icon" asChild>
            <Link href="/company-administrator/surveys/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />
      <Separator />
      <SurveyForm />
    </section>
  );
}
