'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Clock, Users, Star, Award, Target } from 'lucide-react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';

interface OperatorMetrics {
  operatorId: string
  clientsServed: number
  averageTime: string
  satisfaction: number
  efficiency: number
  ranking: number
}

const dailyData = [
  { day: 'Lun', clientes: 15, tiempo: 3.2, satisfaccion: 92 },
  { day: 'Mar', clientes: 18, tiempo: 2.8, satisfaccion: 95 },
  { day: 'Mié', clientes: 12, tiempo: 4.1, satisfaccion: 88 },
  { day: 'Jue', clientes: 20, tiempo: 3.5, satisfaccion: 94 },
  { day: 'Vie', clientes: 16, tiempo: 3.0, satisfaccion: 91 },
];

const hourlyData = [
  { hora: '09:00', clientes: 3 },
  { hora: '10:00', clientes: 5 },
  { hora: '11:00', clientes: 4 },
  { hora: '12:00', clientes: 2 },
  { hora: '13:00', clientes: 1 },
  { hora: '14:00', clientes: 3 },
  { hora: '15:00', clientes: 6 },
  { hora: '16:00', clientes: 4 },
];

const satisfactionData = [
  { name: 'Excelente', value: 65, color: '#22c55e' },
  { name: 'Bueno', value: 25, color: '#3b82f6' },
  { name: 'Regular', value: 8, color: '#f59e0b' },
  { name: 'Malo', value: 2, color: '#ef4444' },
];

export default function EstadisticasPage() {
  const operatorMetrics: OperatorMetrics = {
    operatorId: 'OP-001',
    clientsServed: 81,
    averageTime: '3:15',
    satisfaction: 92,
    efficiency: 95,
    ranking: 3,
  };

  return (
    <>
      <Heading
        title="Mis estadísticas"
      />
      <Separator />
      <section className="grid gap-4">
        {/* Métricas Principales */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes atendidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operatorMetrics.clientsServed}</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operatorMetrics.averageTime}</div>
              <p className="text-xs text-muted-foreground">Por cliente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operatorMetrics.satisfaction}%</div>
              <p className="text-xs text-muted-foreground">Promedio semanal</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ranking</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{operatorMetrics.ranking}</div>
              <p className="text-xs text-muted-foreground">En la sucursal</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Análisis */}
        <Tabs defaultValue="semanal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="semanal">Vista Semanal</TabsTrigger>
            <TabsTrigger value="diaria">Vista Diaria</TabsTrigger>
            <TabsTrigger value="satisfaccion">Satisfacción</TabsTrigger>
          </TabsList>

          <TabsContent value="semanal" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Atendidos por Día</CardTitle>
                  <CardDescription>Rendimiento semanal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="clientes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempo Promedio de Atención</CardTitle>
                  <CardDescription>Minutos por cliente</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="tiempo" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Satisfacción del Cliente</CardTitle>
                <CardDescription>Porcentaje de satisfacción por día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaccion" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diaria" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución Horaria</CardTitle>
                <CardDescription>Clientes atendidos por hora hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clientes" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaccion" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Calificaciones</CardTitle>
                  <CardDescription>Últimas 100 evaluaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {satisfactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objetivos y Metas</CardTitle>
                  <CardDescription>Progreso hacia objetivos mensuales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clientes atendidos</span>
                      <span>81/100</span>
                    </div>
                    <Progress value={81} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Satisfacción objetivo</span>
                      <span>92%/90%</span>
                    </div>
                    <Progress value={100} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tiempo promedio</span>
                      <span>3:15/4:00</span>
                    </div>
                    <Progress value={85} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Eficiencia</span>
                      <span>95%/85%</span>
                    </div>
                    <Progress value={100} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Logros y Reconocimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Logros y Reconocimientos
            </CardTitle>
            <CardDescription>Tus logros más recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Excelencia en Servicio</div>
                  <div className="text-sm text-muted-foreground">Satisfacción {'>'} 90% por 5 días</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Eficiencia Destacada</div>
                  <div className="text-sm text-muted-foreground">Top 3 en la sucursal</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Rapidez</div>
                  <div className="text-sm text-muted-foreground">Tiempo promedio {'<'} 4 min</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
