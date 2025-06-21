'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Calendar,
  Coffee,
  Timer,
  User,
  MapPin,
  Play,
  Pause,
  Plus,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';

export default function TurnoPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftStartTime] = useState(new Date(2025, 0, 25, 9, 0, 0));
  const [shiftEndTime] = useState(new Date(2025, 0, 25, 17, 0, 0));
  const [breakTime, setBreakTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isOnBreak && breakStartTime) {
        const breakDuration = Math.floor(
          (new Date().getTime() - breakStartTime.getTime()) / 1000 / 60,
        );
        setBreakTime(breakDuration);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOnBreak, breakStartTime]);

  const getWorkedHours = () => {
    const worked =
      (currentTime.getTime() - shiftStartTime.getTime()) / 1000 / 60 / 60 -
      breakTime / 60;
    return Math.max(0, worked).toFixed(1);
  };

  const getRemainingHours = () => {
    const remaining =
      (shiftEndTime.getTime() - currentTime.getTime()) / 1000 / 60 / 60;
    return Math.max(0, remaining).toFixed(1);
  };

  const getShiftProgress = () => {
    const total =
      (shiftEndTime.getTime() - shiftStartTime.getTime()) / 1000 / 60 / 60;
    const worked = Number.parseFloat(getWorkedHours());
    return Math.min(100, (worked / total) * 100);
  };

  const handleBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      setBreakStartTime(null);
      setIsActive(true);
    } else {
      setIsOnBreak(true);
      setBreakStartTime(new Date());
      setIsActive(false);
    }
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <section className='grid gap-4'>
      <Heading title='Mi turno' />
      <Separator />
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Estado Actual</CardTitle>
            <User className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isOnBreak
                  ? 'text-yellow-600'
                  : isActive
                    ? 'text-green-600'
                    : 'text-red-600'
              }`}
            >
              {isOnBreak ? 'En Descanso' : isActive ? 'Activo' : 'Inactivo'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {isOnBreak
                ? `${breakTime} min en descanso`
                : isActive
                  ? 'Disponible para atender'
                  : 'No disponible'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Posición</CardTitle>
            <MapPin className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>Caja 1</div>
            <p className='text-xs text-muted-foreground'>Sucursal Centro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Horas Trabajadas
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{getWorkedHours()}h</div>
            <p className='text-xs text-muted-foreground'>
              Quedan {getRemainingHours()}h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Turno</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>09:00 - 17:00</div>
            <p className='text-xs text-muted-foreground'>8 horas programadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Control de Estado y Tiempo */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Timer className='h-5 w-5 mr-2' />
              Control de Estado
            </CardTitle>
            <CardDescription>
              Gestiona tu disponibilidad y descansos
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col space-y-2'>
              <Button
                onClick={handleToggleActive}
                variant={isActive ? 'default' : 'outline'}
                className='w-full'
                size='lg'
                disabled={isOnBreak}
              >
                {isActive ? (
                  <Pause className='h-4 w-4 mr-2' />
                ) : (
                  <Play className='h-4 w-4 mr-2' />
                )}
                {isActive ? 'Pausar Atención' : 'Activar Atención'}
              </Button>

              <Button
                onClick={handleBreak}
                variant={isOnBreak ? 'default' : 'outline'}
                className='w-full'
                size='lg'
              >
                <Coffee className='h-4 w-4 mr-2' />
                {isOnBreak ? 'Terminar Descanso' : 'Iniciar Descanso'}
              </Button>
            </div>

            {isOnBreak && (
              <div className='p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-yellow-800'>
                    En Descanso
                  </span>
                  <Badge
                    variant='outline'
                    className='border-yellow-600 text-yellow-600'
                  >
                    {breakTime} min
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground mt-1'>
                  Iniciado a las {breakStartTime?.toLocaleTimeString()}
                </p>
              </div>
            )}

            {!isActive && !isOnBreak && (
              <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-red-800'>
                    Atención Pausada
                  </span>
                  <Badge
                    variant='outline'
                    className='border-red-600 text-red-600'
                  >
                    Inactivo
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground mt-1'>
                  No recibirás nuevos clientes hasta reactivar
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Calendar className='h-5 w-5 mr-2' />
              Detalles del Turno
            </CardTitle>
            <CardDescription>Información de tu jornada laboral</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Hora de inicio:</span>
              <span className='text-sm'>
                {shiftStartTime.toLocaleTimeString()}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Hora de fin:</span>
              <span className='text-sm'>
                {shiftEndTime.toLocaleTimeString()}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Duración total:</span>
              <span className='text-sm'>8 horas</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium'>Tiempo de descanso:</span>
              <span className='text-sm'>{breakTime} minutos</span>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Progreso del turno</span>
                <span>{getShiftProgress().toFixed(0)}%</span>
              </div>
              <Progress value={getShiftProgress()} className='w-full' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas del Día */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas del Día</CardTitle>
          <CardDescription>Resumen de tu rendimiento hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-4'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>15</div>
              <div className='text-sm text-blue-600'>Clientes Atendidos</div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>3:45</div>
              <div className='text-sm text-green-600'>Tiempo Promedio</div>
            </div>
            <div className='text-center p-4 bg-purple-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600'>92%</div>
              <div className='text-sm text-purple-600'>Satisfacción</div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>95%</div>
              <div className='text-sm text-orange-600'>Eficiencia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial del Día */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad del Día</CardTitle>
          <CardDescription>Cronología de eventos importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm'>Inicio de turno</span>
              </div>
              <span className='text-sm text-muted-foreground'>09:00</span>
            </div>

            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm'>Primer cliente atendido</span>
              </div>
              <span className='text-sm text-muted-foreground'>09:15</span>
            </div>

            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                <span className='text-sm'>Descanso (15 min)</span>
              </div>
              <span className='text-sm text-muted-foreground'>
                11:00 - 11:15
              </span>
            </div>

            <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                <span className='text-sm'>Almuerzo (30 min)</span>
              </div>
              <span className='text-sm text-muted-foreground'>
                13:00 - 13:30
              </span>
            </div>

            {isOnBreak && (
              <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></div>
                  <span className='text-sm font-medium'>Descanso actual</span>
                </div>
                <span className='text-sm text-yellow-600'>
                  {breakStartTime?.toLocaleTimeString()} - Activo
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
