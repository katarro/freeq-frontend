'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OperatorValues } from '@/lib/schemas';

import OperatorTableRow from './operator-table-row';
import OperatorDetailsDialog from './operator-details-dialog';
import SendMessageDialog from './send-message-dialog';

type Props = {
  operators: OperatorValues[];
};

export default function OperatorActivityTable({ operators }: Props) {
  const [selectedOperator, setSelectedOperator] = useState<OperatorValues | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleViewDetails = (operator: OperatorValues) => {
    setSelectedOperator(operator);
    setIsDetailDialogOpen(true);
  };

  const handleSendMessage = (operator: OperatorValues) => {
    setSelectedOperator(operator);
    setIsMessageDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col-reverse lg:flex-row items-start gap-2 lg:items-center justify-between">
            <span>Actividad de Operadores en Tiempo Real</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">En vivo</span>
            </div>
          </CardTitle>
          <CardDescription>Estado actual y métricas de rendimiento de todos los ejecutivos</CardDescription>
        </CardHeader>
        <CardContent className="">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Operador</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Caja/Fila</TableHead>
                <TableHead>Cliente Actual</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>En Espera</TableHead>
                <TableHead>Eficiencia</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <OperatorTableRow
                  key={operator.id}
                  operator={operator}
                  onViewDetails={handleViewDetails}
                  onSendMessage={handleSendMessage}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OperatorDetailsDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        operator={selectedOperator}
      />

      <SendMessageDialog
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        operator={selectedOperator}
        onMessageSent={() => {
          setIsMessageDialogOpen(false);
          setSelectedOperator(null);
        }}
      />
    </>
  );
}
