'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  sectionErrors: Record<string, number>
  onViewErrors: (section: string) => void
}

export default function ValidationAlert({ sectionErrors, onViewErrors }: Props) {
  const totalErrors = Object.values(sectionErrors).reduce((sum, count) => sum + count, 0);
  const errorSections = Object.entries(sectionErrors).filter(([_, count]) => count > 0);

  if (totalErrors === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Validation Error</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          There {totalErrors === 1 ? 'is' : 'are'} {totalErrors} {totalErrors === 1 ? 'error' : 'errors'} in your
          configuration:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          {errorSections.map(([section, count]) => (
            <li key={section} className="flex items-center justify-between">
              <span>
                {section}: {count} {count === 1 ? 'error' : 'errors'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewErrors(section)}
              >
                View errors
              </Button>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
