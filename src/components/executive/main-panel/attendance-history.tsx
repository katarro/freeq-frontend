import { Progress } from '@radix-ui/react-progress';
import { AttendanceHistory } from '@/types/ticket';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '../../ui/card';
import {
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
  Table,
} from '../../ui/table';

const attendanceHistory: AttendanceHistory[] = [
  {
    id: 1,
    client: 'Cliente #001',
    startTime: '09:15',
    endTime: '09:18',
    duration: '3:12',
    satisfaction: 95,
    operatorId: 'OP-001',
  },
  {
    id: 2,
    client: 'Cliente #002',
    startTime: '09:20',
    endTime: '09:25',
    duration: '4:45',
    satisfaction: 88,
    operatorId: 'OP-001',
  },
  {
    id: 3,
    client: 'Cliente #003',
    startTime: '09:28',
    endTime: '09:31',
    duration: '2:58',
    satisfaction: 92,
    operatorId: 'OP-001',
  },
  {
    id: 4,
    client: 'Cliente #004',
    startTime: '09:35',
    endTime: '09:39',
    duration: '3:22',
    satisfaction: 90,
    operatorId: 'OP-001',
  },
];

export function AttendanceHistoryTable() {
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
