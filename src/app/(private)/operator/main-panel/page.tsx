'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Users, Play, Timer, TrendingUp, User, UserX, CheckCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';

interface ShiftStatus {
  operatorId: string
  status: 'active' | 'absent' | 'break' | 'completed'
  currentClient: string | null
  queueCount: number
  canTakeNext: boolean
  lastAction: 'completed' | 'absent' | 'none'
}

interface AttendanceHistory {
  id: number
  client: string
  startTime: string
  endTime: string
  duration: string
  satisfaction: number
  operatorId: string
}

export default function MainPanelPage() {
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>({
    operatorId: 'OP-001',
    status: 'active',
    currentClient: null,
    queueCount: 8,
    canTakeNext: true,
    lastAction: 'none',
  });

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

  const handleNext = () => {
    if (!shiftStatus.canTakeNext) return;

    const newClient = `Cliente #${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setShiftStatus((prev) => ({
      ...prev,
      currentClient: newClient,
      queueCount: prev.queueCount - 1,
      status: 'active',
      canTakeNext: false,
      lastAction: 'none',
    }));
  };

  const handleAbsent = () => {
    setShiftStatus((prev) => ({
      ...prev,
      status: prev.status === 'absent' ? 'active' : 'absent',
      canTakeNext: prev.status === 'absent' ? false : true,
      lastAction: prev.status === 'absent' ? 'none' : 'absent',
    }));
  };

  const handleCompleted = () => {
    setShiftStatus((prev) => ({
      ...prev,
      currentClient: null,
      status: 'active',
      canTakeNext: true,
      lastAction: 'completed',
    }));
  };

  const getStatusText = () => {
    switch (shiftStatus.status) {
    case 'absent':
      return 'Ausente';
    case 'active':
      return shiftStatus.currentClient ? 'Atendiendo' : 'Activo';
    default:
      return 'Activo';
    }
  };

  const getStatusColor = () => {
    switch (shiftStatus.status) {
    case 'absent':
      return 'text-destructive';
    case 'active':
      return shiftStatus.currentClient ? 'text-warning' : 'text-success';
    default:
      return 'text-success';
    }
  };

  return (
    <>
      <section className="grid gap-4">
        <Heading
          title="Panel operador"
        />
        <Separator />
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado del Turno</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor()}`}>{getStatusText()}</div>
              <p className="text-xs text-muted-foreground">Caja 1 - Turno Mañana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fila Asignada</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shiftStatus.queueCount}</div>
              <p className="text-xs text-muted-foreground">Clientes en espera</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3:45</div>
              <p className="text-xs text-muted-foreground">Por cliente hoy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendidos Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Clientes completados</p>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Control Principal */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Control de Atención</CardTitle>
              <CardDescription>
                {shiftStatus.currentClient ? `Atendiendo: ${shiftStatus.currentClient}` : 'Sin cliente en atención'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleNext}
                  disabled={!shiftStatus.canTakeNext || shiftStatus.status === 'absent'}
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Siguiente
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleAbsent}
                    variant={shiftStatus.status === 'absent' ? 'default' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    {shiftStatus.status === 'absent' ? 'Regresar' : 'Ausente'}
                  </Button>
                  <Button
                    onClick={handleCompleted}
                    disabled={shiftStatus.currentClient === null}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completado
                  </Button>
                </div>
              </div>

              {!shiftStatus.canTakeNext && shiftStatus.lastAction === 'none' && shiftStatus.currentClient && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-medium">
                    Debe marcar como Completado o Ausente antes de atender el siguiente cliente
                  </p>
                </div>
              )}

              {shiftStatus.currentClient && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cliente Actual:</span>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {shiftStatus.currentClient}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Tiempo transcurrido:</span>
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-1" />
                      <span className="text-sm font-mono">2:15</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de la Fila en Tiempo Real</CardTitle>
              <CardDescription>Vista actual de clientes en espera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clientes en fila:</span>
                  <Badge variant="outline">{shiftStatus.queueCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tiempo estimado de espera:</span>
                  <span className="text-sm">{Math.ceil(shiftStatus.queueCount * 3.75)} min</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del día</span>
                    <span>12/20 objetivo</span>
                  </div>
                  <Progress value={60} className="w-full" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-medium text-green-700">Satisfacción</div>
                    <div className="text-lg font-bold">91%</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-medium text-blue-700">Eficiencia</div>
                    <div className="text-lg font-bold">95%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial de Atención */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Atención</CardTitle>
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
                    <TableCell className="font-medium">{record.client}</TableCell>
                    <TableCell>{record.startTime}</TableCell>
                    <TableCell>{record.endTime}</TableCell>
                    <TableCell>{record.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={record.satisfaction} className="w-16" />
                        <span className="text-sm font-medium">{record.satisfaction}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
