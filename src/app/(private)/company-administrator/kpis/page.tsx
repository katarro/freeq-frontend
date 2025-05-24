'use client';

import { useState } from 'react';
import { Clock, Store, ThumbsUp, Users } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/cards/stat-card';
import OverviewChart from '@/app/(private)/company-administrator/kpis/_components/overview-chart';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useIsMobile } from '@/hooks/use-mobile';
import { branchData } from '@/app/(private)/company-administrator/kpis/data';

export default function KpisPage () {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  const tabOptions = [
    { value: 'overview', label: 'Resumen' },
    { value: 'performance', label: 'Rendimiento de sucursales' },
    { value: 'table', label: 'Tabla de sucursales' },
  ];


  return (
    <section className="grid gap-6">
      <Heading title="KPIs de sucursales"/>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Sucursales"
          value="12"
          icon={<Store className="h-4 w-4" />}
          trend="up"
          trendValue="2 nuevas este mes"
        />
        <StatCard
          title="Total de Usuarios"
          value="2,845"
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue="18% desde el mes pasado"
        />
        <StatCard
          title="Tiempo Promedio"
          value="3.8 min"
          icon={<Clock className="h-4 w-4" />}
          trend="down"
          trendValue="12% desde el mes pasado"
        />
        <StatCard
          title="Satisfacción"
          value="92%"
          icon={<ThumbsUp className="h-4 w-4" />}
          trend="up"
          trendValue="5% desde el mes pasado"
        />
      </div>

      <div className="grid gap-4">
        {isMobile ? (
          <div className="w-full">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar vista" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {tabOptions.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="">
          {activeTab === 'overview' && (
            <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
              <OverviewChart />
              <div className="">
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimas actividades del sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'Nuevo gerente de sucursal asignado', branch: 'Santiago Centro', time: 'hace 2 horas' },
                        { action: 'Mantenimiento del sistema completado', branch: 'Todas las sucursales', time: 'hace 4 horas' },
                        { action: 'Resultados de la encuesta actualizados', branch: 'Providencia', time: 'hace 6 horas' },
                        { action: 'Nuevo ejecutivo añadido', branch: 'Las Condes', time: 'hace 8 horas' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center">
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.branch}</p>
                          </div>
                          <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Sucursales</CardTitle>
                <CardDescription>Comparación del tiempo de servicio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Santiago Centro', time: '2.5 min', satisfaction: '95%', color: 'bg-green-500' },
                    { name: 'Providencia', time: '3.2 min', satisfaction: '92%', color: 'bg-green-400' },
                    { name: 'Las Condes', time: '3.8 min', satisfaction: '90%', color: 'bg-green-300' },
                    { name: 'Ñuñoa', time: '4.1 min', satisfaction: '88%', color: 'bg-yellow-400' },
                    { name: 'Maipú', time: '4.5 min', satisfaction: '85%', color: 'bg-yellow-500' },
                  ].map((branch, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{branch.name}</span>
                          <span className="text-sm font-medium">{branch.time}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${branch.color} h-2.5 rounded-full`}
                            style={{ width: branch.satisfaction }}
                          ></div>
                        </div>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-muted-foreground">Satisfacción: {branch.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'table' && (
            <Card>
              <CardHeader>
                <CardTitle>Tabla dea rendimiento de sucursales</CardTitle>
                <CardDescription>Métricas detalladas de rendimiento para todas las sucursales</CardDescription>
              </CardHeader>
              <CardContent className="grid overflow-x-auto">
                <div className="rounded-md border overflow-hidden">
                  <Table className="overflow-x-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sucursal</TableHead>
                        <TableHead>Tickets Atendidos</TableHead>
                        <TableHead>Tiempo Prom. Espera</TableHead>
                        <TableHead>Tiempo Prom. Servicio</TableHead>
                        <TableHead>Satisfacción</TableHead>
                        <TableHead>Eficiencia</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branchData.map((branch, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{branch.name}</TableCell>
                          <TableCell>{branch.tickets}</TableCell>
                          <TableCell>{branch.waitTime}</TableCell>
                          <TableCell>{branch.serviceTime}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${branch.satisfaction >= 90 ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                ${
                        branch.satisfaction >= 80 && branch.satisfaction < 90
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : ''
                        }
                                ${branch.satisfaction < 80 ? 'bg-red-100 text-red-800 border-red-200' : ''}
                              `}
                            >
                              {branch.satisfaction}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${branch.efficiency >= 85 ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                ${
                        branch.efficiency >= 70 && branch.efficiency < 85
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : ''
                        }
                                ${branch.efficiency < 70 ? 'bg-red-100 text-red-800 border-red-200' : ''}
                              `}
                            >
                              {branch.efficiency}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {branch.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
