import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, MessageSquare } from 'lucide-react';

import OperatorStatusBadge from '../operator-status-badge';
import { OperatorValues } from '@/lib/schemas';

type OperatorTableRowProps = {
  operator: OperatorValues;
  onViewDetails: (operator: OperatorValues) => void;
  onSendMessage: (operator: OperatorValues) => void;
};

export default function OperatorTableRow({ operator, onViewDetails, onSendMessage }: OperatorTableRowProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
    case 'Atendiendo':
      return <MessageSquare className="h-4 w-4 text-success" />;
    case 'Disponible':
      return <Eye className="h-4 w-4 text-primary" />;
    case 'Ausente':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'Descanso':
      return <MessageSquare className="h-4 w-4 text-warning" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <TableRow key={operator.id} className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              {operator.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{operator.name}</div>
            <div className="text-sm text-muted-foreground">Atendidos: {operator.served}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <OperatorStatusBadge status={operator.status} />
      </TableCell>
      <TableCell>
        <div className="font-medium">{operator.queue}</div>
      </TableCell>
      <TableCell>
        {operator.currentClient ? (
          <div>
            <div className="font-medium">{operator.currentClient}</div>
            <div className="text-sm text-muted-foreground">
              Tiempo: {operator.timeWithClient}
              {operator.timeWithClient && operator.timeWithClient > '04:00' && (
                <AlertTriangle className="inline h-3 w-3 ml-1 text-warning" />
              )}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div>Promedio: {operator.avgTime}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{operator.waitingClients}</span>
          {operator.waitingClients > 6 && <AlertTriangle className="h-4 w-4 text-warning" />}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Progress value={operator.efficiency} className="w-16" />
          <span className="text-sm font-medium">{operator.efficiency}%</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{operator.lastActivity}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            title="Ver detalles"
            onClick={() => onViewDetails(operator)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Enviar mensaje"
            onClick={() => onSendMessage(operator)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
