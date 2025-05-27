import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import type { CompanyParametersValues } from '@/lib/schemas/company-parameters-schema';
import type { UseFormReturn } from 'react-hook-form';

type Props  ={
  title: string
  section: string
  sectionErrors: Record<string, number>
  form: UseFormReturn<CompanyParametersValues>
  sectionFields: Record<string, string[]>
}

export default function HeaderSection({ title, section, sectionErrors, form, sectionFields }: Props) {
  const errorCount = sectionErrors[section];
  const hasDirtyFields = sectionFields[section].some(
    (field) => form.formState.dirtyFields[field as keyof CompanyParametersValues],
  );

  return (
    <div className="flex items-center">
      <span className="text-base font-semibold">{title}</span>
      {errorCount > 0 ? (
        <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
          {errorCount}
        </Badge>
      ) : hasDirtyFields ? (
        <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
      ) : null}
    </div>
  );
}
