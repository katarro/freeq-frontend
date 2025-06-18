import { Progress } from '@radix-ui/react-progress';
import { AttendanceHistory } from '@/types/ticket';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '../ui/card';
import {
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
  Table,
} from '../ui/table';

export function AttendanceHistoryTable({
  attendanceHistory,
}: Readonly<{
  attendanceHistory: AttendanceHistory[];
}>) {
  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle>Historial de atención</CardTitle>
        <CardDescription>Últimos clientes atendidos hoy</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Hora Inicio</TableHead>
              <TableHead>Hora Fin</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Satisfacción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell className='font-medium'>{record.client}</TableCell>
                <TableCell>{record.startTime}</TableCell>
                <TableCell>{record.endTime}</TableCell>
                <TableCell>{record.duration}</TableCell>
                <TableCell>
                  <div className='flex items-center space-x-2'>
                    <Progress value={record.satisfaction} className='w-16' />
                    <span className='text-sm font-medium'>
                      {record.satisfaction}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
