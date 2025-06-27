'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import {
  ClipboardList,
  TrendingUp,
  Star,
  Award,
  BarChart3,
  MessageSquare,
  Calendar,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Download,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { operatorSurveyResults, satisfactionDistribution } from './data';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import SurveyResultsTable from '@/app/(private)/admin-business/survey-results/_components/survey-results-table';
import { OperatorValues } from '@/lib/schemas';

export default function SurveyResultsPage() {
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [chartsDialogOpen, setChartsDialogOpen] = useState(false);
  const [currentOperator, setCurrentOperator] = useState<OperatorValues | null>(null);
  const isMobile = useIsMobile();

  const getPerformanceBadge = (score: number) => {
    if (score >= 95) return 'bg-green-100 text-green-800';
    if (score >= 90) return 'bg-blue-100 text-blue-800';
    if (score >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'text-green-600';
    if (rating >= 4) return 'text-blue-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const openDetailsDialog = (operator: OperatorValues) => {
    setCurrentOperator(operator);
    setDetailsDialogOpen(true);
  };

  const openCommentsDialog = (operator: OperatorValues) => {
    setCurrentOperator(operator);
    setCommentsDialogOpen(true);
  };

  const openChartsDialog = (operator: OperatorValues) => {
    setCurrentOperator(operator);
    setChartsDialogOpen(true);
  };

  return (
    <>
      <section className="grid gap-4">
        <Heading
          title="Resultados de encuestas por operador"
          right={
            <Button aria-label="Exportar">
              <Download />
              Exportar
            </Button>
          }
        />
        <Separator />
        {/* Resumen General */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Respuestas</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {operatorSurveyResults.reduce((sum, op) => sum + (op.totalResponses ?? 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  operatorSurveyResults.reduce(
                    (sum, op) => sum + (op.averageSatisfaction ?? 0),
                    0,
                  ) / operatorSurveyResults.length,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">+2% vs mes anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mejor Operador</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">María R.</div>
              <p className="text-xs text-muted-foreground">96% satisfacción</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tendencia General</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+2.5%</div>
              <p className="text-xs text-muted-foreground">Mejora mensual</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Resultados por Operador */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados Detallados por Operador</CardTitle>
            <CardDescription>Análisis de satisfacción y rendimiento individual</CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyResultsTable
              data={operatorSurveyResults}
              onOpenDetailsDialog={openDetailsDialog}
              onOpenCommentsDialog={openCommentsDialog}
              onOpenChartsDialog={openChartsDialog}
            />
          </CardContent>
        </Card>

        {/* Gráficos de Análisis */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Comparación de Satisfacción por Operador</CardTitle>
              <CardDescription>Rendimiento comparativo del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={operatorSurveyResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Bar dataKey="averageSatisfaction" fill="#0194ad" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución General de Satisfacción</CardTitle>
              <CardDescription>Porcentaje de respuestas por nivel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={satisfactionDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {satisfactionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Diálogo de Detalles del Operador */}
      {isMobile ? (
        <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>
                    {currentOperator?.name
                      ? currentOperator.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                      : '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl font-bold">{currentOperator?.name}</div>
                  <div className="text-sm text-muted-foreground">{currentOperator?.position}</div>
                </div>
              </SheetTitle>
              <SheetDescription>
                Información completa del operador y métricas de rendimiento
              </SheetDescription>
            </SheetHeader>

            {currentOperator && (
              <div className="space-y-6 mt-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Información General
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de inicio:</span>
                        <span>{currentOperator?.details?.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clientes atendidos:</span>
                        <span>{currentOperator?.details?.totalCustomers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiempo promedio:</span>
                        <span>{currentOperator?.details?.averageServiceTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tasa de resolución:</span>
                        <span className="text-green-600">
                          {currentOperator?.details?.resolutionRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tasa de escalación:</span>
                        <span className="text-red-600">
                          {currentOperator?.details?.escalationRate}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Competencias
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-muted-foreground">Idiomas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentOperator?.details?.languages?.map((lang, index) => (
                            <Badge key={index} variant="secondary">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Certificaciones:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentOperator?.details?.certifications?.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Métricas de Rendimiento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Métricas de Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Satisfacción por Categorías</h4>
                        <div className="space-y-2">
                          {Object.entries(currentOperator?.categories || {}).map(
                            ([category, value]) => (
                              <div key={category} className="flex items-center justify-between">
                                <span className="text-sm capitalize">{category}:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${value}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-10">{value}%</span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-3">Tendencia Diaria</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={currentOperator.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis domain={[80, 100]} />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="satisfaction"
                              stroke="#0194ad"
                              fill="#0194ad"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="w-[80vw] !max-w-full  max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>
                    {currentOperator?.name
                      ?.split(' ')
                      ?.map((n) => n[0])
                      ?.join('') ?? 'OP'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl font-bold">{currentOperator?.name}</div>
                  <div className="text-sm text-muted-foreground">{currentOperator?.position}</div>
                </div>
              </DialogTitle>
              <DialogDescription>
                Información completa del operador y métricas de rendimiento
              </DialogDescription>
            </DialogHeader>

            {currentOperator && (
              <div className="space-y-6">
                {/* Información Personal */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Información General
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de inicio:</span>
                        <span>{currentOperator?.details?.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clientes atendidos:</span>
                        <span>{currentOperator?.details?.totalCustomers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiempo promedio:</span>
                        <span>{currentOperator?.details?.averageServiceTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tasa de resolución:</span>
                        <span className="text-green-600">
                          {currentOperator?.details?.resolutionRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tasa de escalación:</span>
                        <span className="text-red-600">
                          {currentOperator?.details?.escalationRate}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Competencias
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-muted-foreground">Idiomas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentOperator?.details?.languages?.map((lang, index) => (
                            <Badge key={index} variant="secondary">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Certificaciones:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentOperator?.details?.certifications?.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Métricas de Rendimiento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Métricas de Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Satisfacción por Categorías</h4>
                        <div className="space-y-2">
                          {Object.entries(currentOperator?.categories || {}).map(
                            ([category, value]) => (
                              <div key={category} className="flex items-center justify-between">
                                <span className="text-sm capitalize">{category}:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${value}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-10">{value}%</span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-3">Tendencia Diaria</h4>
                        <ResponsiveContainer width="100%" height={150}>
                          <AreaChart data={currentOperator.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis domain={[80, 100]} />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="satisfaction"
                              stroke="#0194ad"
                              fill="#0194ad"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de Comentarios */}
      {isMobile ? (
        <Sheet open={commentsDialogOpen} onOpenChange={setCommentsDialogOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                Comentarios - {currentOperator?.name}
              </SheetTitle>
              <SheetDescription>
                Feedback detallado de los clientes sobre la atención recibida
              </SheetDescription>
            </SheetHeader>

            {currentOperator && (
              <div className="space-y-4 mt-6">
                {/* Resumen de Comentarios */}
                <div className="grid gap-4 grid-cols-3">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-600">
                          {currentOperator.recentComments?.filter((c) => c.rating >= 4).length ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Positivos</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-yellow-600">
                          {currentOperator.recentComments?.filter((c) => c.rating === 3).length ??
                            0}
                        </p>
                        <p className="text-xs text-muted-foreground">Neutrales</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-red-600">
                          {currentOperator.recentComments?.filter((c) => c.rating < 3).length ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Negativos</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de Comentarios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comentarios Recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {currentOperator.recentComments?.map((comment, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < comment.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span
                                className={`text-sm font-medium ${getRatingColor(comment.rating)}`}
                              >
                                {comment.rating}/5
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">{comment.date}</div>
                          </div>
                          <p className="text-sm mb-2">&quot;{comment.text}&quot;</p>
                          <div className="text-xs text-muted-foreground">{comment.customer}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={commentsDialogOpen} onOpenChange={setCommentsDialogOpen}>
          <DialogContent className="w-[80vw] !max-w-full max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                Comentarios de Clientes - {currentOperator?.name}
              </DialogTitle>
              <DialogDescription>
                Feedback detallado de los clientes sobre la atención recibida
              </DialogDescription>
            </DialogHeader>

            {currentOperator && (
              <div className="space-y-4">
                {/* Resumen de Comentarios */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {currentOperator.recentComments?.filter((c) => c.rating >= 4).length ??
                              0}
                          </p>
                          <p className="text-sm text-muted-foreground">Positivos</p>
                        </div>
                        <ThumbsUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">
                            {currentOperator.recentComments?.filter((c) => c.rating === 3).length ??
                              0}
                          </p>
                          <p className="text-sm text-muted-foreground">Neutrales</p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-red-600">
                            {currentOperator.recentComments?.filter((c) => c.rating < 3).length ??
                              0}
                          </p>
                          <p className="text-sm text-muted-foreground">Negativos</p>
                        </div>
                        <ThumbsDown className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de Comentarios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comentarios Recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {currentOperator.recentComments?.map((comment, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < comment.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span
                                  className={`text-sm font-medium ${getRatingColor(comment.rating)}`}
                                >
                                  {comment.rating}/5
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {comment.date}
                              </div>
                            </div>
                            <p className="text-sm mb-2">&quot;{comment.text}&quot;</p>
                            <div className="text-xs text-muted-foreground">{comment.customer}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de Gráficos Detallados */}
      {isMobile ? (
        <Sheet open={chartsDialogOpen} onOpenChange={setChartsDialogOpen}>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6" />
                Gráficos - {currentOperator?.name}
              </SheetTitle>
              <SheetDescription>
                Visualización completa del rendimiento y tendencias
              </SheetDescription>
            </SheetHeader>

            {currentOperator && (
              <Tabs defaultValue="trends" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trends">Tendencias</TabsTrigger>
                  <TabsTrigger value="categories">Categorías</TabsTrigger>
                  <TabsTrigger value="comparison">Comparación</TabsTrigger>
                </TabsList>

                <TabsContent value="trends" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendencia Semanal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={currentOperator.weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis domain={[80, 100]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="satisfaction"
                            stroke="#0194ad"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rendimiento Diario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={currentOperator.dailyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="satisfaction" fill="#0194ad" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análisis Radar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart
                          data={Object.entries(currentOperator?.categories || {}).map(
                            ([key, value]) => ({
                              category: key,
                              value: value || 0,
                              fullMark: 100,
                            }),
                          )}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar
                            dataKey="value"
                            stroke="#0194ad"
                            fill="#0194ad"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparación con Promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={Object.entries(currentOperator.categories || {}).map(
                            ([key, value]) => ({
                              category: key,
                              operador: value || 0,
                              promedio: Math.round(
                                operatorSurveyResults.reduce(
                                  (sum, op) =>
                                    sum +
                                    ((op?.categories as Record<string, number | undefined>)?.[
                                      key
                                    ] ?? 0),
                                  0,
                                ) / operatorSurveyResults.length,
                              ),
                            }),
                          )}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="operador" fill="#0194ad" name="Operador" />
                          <Bar dataKey="promedio" fill="#35ad77" name="Promedio" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={chartsDialogOpen} onOpenChange={setChartsDialogOpen}>
          <DialogContent className="w-[80vw] !max-w-full max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6" />
                Análisis Gráfico Detallado - {currentOperator?.name}
              </DialogTitle>
              <DialogDescription>
                Visualización completa del rendimiento y tendencias
              </DialogDescription>
            </DialogHeader>

            {currentOperator && (
              <Tabs defaultValue="trends" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trends">Tendencias</TabsTrigger>
                  <TabsTrigger value="categories">Categorías</TabsTrigger>
                  <TabsTrigger value="comparison">Comparación</TabsTrigger>
                </TabsList>

                <TabsContent value="trends" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tendencia Semanal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={currentOperator.weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis domain={[80, 100]} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="satisfaction"
                              stroke="#0194ad"
                              strokeWidth={3}
                            />
                            <Line
                              type="monotone"
                              dataKey="responses"
                              stroke="#35ad77"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Rendimiento Diario</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={currentOperator.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="satisfaction" fill="#0194ad" />
                            <Bar dataKey="responses" fill="#35ad77" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Análisis Radar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart
                            data={Object.entries(currentOperator.categories || {}).map(
                              ([key, value]) => ({
                                category: key,
                                value,
                                fullMark: 100,
                              }),
                            )}
                          >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="category" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar
                              dataKey="value"
                              stroke="#0194ad"
                              fill="#0194ad"
                              fillOpacity={0.3}
                            />
                            <Radar dataKey="fullMark" stroke="#e5e7eb" fill="transparent" />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución por Categorías</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart
                            data={Object.entries(currentOperator.categories || {}).map(
                              ([key, value]) => ({
                                category: key,
                                value,
                              }),
                            )}
                            layout="horizontal"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="category" type="category" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#0194ad" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparación con Promedio del Equipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={Object.entries(currentOperator.categories || {}).map(
                            ([key, value]) => ({
                              category: key,
                              operador: value,
                              promedio: Math.round(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                operatorSurveyResults.reduce(
                                  (sum, op) =>
                                    sum +
                                    (op?.categories?.[key as keyof typeof op.categories] || 0),
                                  0,
                                ) / operatorSurveyResults.length,
                              ),
                            }),
                          )}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="operador" fill="#0194ad" name="Operador" />
                          <Bar dataKey="promedio" fill="#35ad77" name="Promedio Equipo" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
