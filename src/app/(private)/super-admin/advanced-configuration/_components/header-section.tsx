import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';

type Props = {
  title: string
  errorCount: number
  isValid: boolean
  hasChanges: boolean
}

export default function HeaderSection({ title, errorCount, isValid, hasChanges }: Props   ) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-base font-medium">{title}</span>
      <div className="flex items-center gap-2">
        {errorCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errorCount} {errorCount === 1 ? 'error' : 'errors'}
          </Badge>
        )}
        {errorCount === 0 && hasChanges && isValid && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            <Check className="w-3 h-3 mr-1" />
            Validar
          </Badge>
        )}
      </div>
    </div>
  );
}
