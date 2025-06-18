import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle, Pause, AlertTriangle } from 'lucide-react';

type Props = {
  status: string;
};

export default function OperatorStatusBadge({ status }: Props) {
  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
    case 'Atendiendo':
      return <Activity className="h-4 w-4 text-success" />;
    case 'Disponible':
      return <CheckCircle className="h-4 w-4 text-primary" />;
    case 'Ausente':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'Descanso':
      return <Pause className="h-4 w-4 text-warning" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
    case 'Atendiendo':
      return 'bg-success/10 text-success border-success/20';
    case 'Disponible':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Ausente':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Descanso':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon(status)}
      <Badge variant="outline" className={getStatusColor(status)}>
        {status}
      </Badge>
    </div>
  );
}
