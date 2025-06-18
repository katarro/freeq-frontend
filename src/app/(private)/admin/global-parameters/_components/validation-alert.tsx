'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

type Props = {
  sectionErrors: Record<string, number>
  totalErrors: number
  onSectionClick: (section: string) => void
}

export default function ValidationAlert({ sectionErrors, totalErrors, onSectionClick }: Props) {
  const sectionNames = {
    general: 'General',
    notifications: 'Notifications',
    security: 'Security',
    integrations: 'Integrations',
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Validation Error ({totalErrors} errors)</AlertTitle>
      <AlertDescription>
        There are errors in the form that must be corrected before saving:
        <ul className="mt-2 list-disc list-inside">
          {Object.entries(sectionErrors).map(
            ([section, count]) =>
              count > 0 && (
                <li key={section}>
                  <strong>{sectionNames[section as keyof typeof sectionNames]}</strong>: {count} error
                  {count > 1 ? 's' : ''}
                  <Button
                    variant="link"
                    className="p-0 ml-2 h-auto text-destructive underline"
                    onClick={() => onSectionClick(section)}
                  >
                    View errors
                  </Button>
                </li>
              ),
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
