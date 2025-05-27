'use client';

import { useState, MouseEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Clock, AlertTriangle, Plus, Edit, Trash2, Star, Timer, UserX, LoaderCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { absenceRules, priorityRules, timeRules } from '@/app/(private)/subsidiary-manager/queue-rules/data';
import Heading from '@/components/heading';
import Link from 'next/link';
import { cn, wait } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QueueRulesPage() {
  const [activeTab, setActiveTab] = useState('tiempos');
  const isMobile = useIsMobile();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabItems = [
    { value: 'tiempos', label: 'Límites de Tiempo', icon: Clock },
    { value: 'ausencias', label: 'Control de Ausencias', icon: UserX },
    { value: 'prioridad', label: 'Niveles de Prioridad', icon: Star },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'Activa':
      return 'bg-success/10 text-success border-success/20';
    case 'Inactiva':
      return 'bg-muted/10 text-muted-foreground border-muted/20';
    case 'Pausada':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'Muy Alta':
      return 'bg-red-100 text-red-800';
    case 'Alta':
      return 'bg-orange-100 text-orange-800';
    case 'Media':
      return 'bg-yellow-100 text-yellow-800';
    case 'Baja':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getRulesByType = (type: 'tiempos' | 'ausencias' | 'prioridad') => {
    switch (type) {
    case 'tiempos':
      return timeRules.filter(
        (rule) =>
          (rule.name?.toLowerCase().includes('tiempo') || false) ||
            (rule.name?.toLowerCase().includes('alerta') || false) ||
            (rule.description?.toLowerCase().includes('tiempo') || false),
      );
    case 'ausencias':
      return absenceRules.filter(
        (rule) =>
          (rule.name?.toLowerCase().includes('ausencia') || false) ||
            (rule.name?.toLowerCase().includes('descanso') || false) ||
            (rule.description?.toLowerCase().includes('ausencia') || false) ||
            (rule.description?.toLowerCase().includes('descanso') || false),
      );
    case 'prioridad':
      return priorityRules.filter(
        (rule) =>
          (rule.name?.toLowerCase().includes('vip') || false) ||
            (rule.name?.toLowerCase().includes('adulto') || false) ||
            (rule.name?.toLowerCase().includes('discapacidad') || false) ||
            (rule.description?.toLowerCase().includes('prioridad') || false),
      );
    default:
      return [];
    }
  };

  const handleDeleteClick = (ruleId: string, ruleName: string) => {
    setRuleToDelete({ id: ruleId, name: ruleName });
    setIsAlertDialogOpen(true);
  };

  const confirmDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (ruleToDelete === null) return;

    setIsDeleting(true);
    try {
      await wait(3000);
      toast.success(`Regla "${ruleToDelete.name}" (ID: ${ruleToDelete.id}) eliminada.`);
    } catch (error) {
      console.error('Error al eliminar la regla:', error);
      toast.error('Ocurrió un error al eliminar la regla. Inténtalo de nuevo.');
    } finally {
      setIsDeleting(false);
      setIsAlertDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  return (
    <>
      <section className="grid gap-4">
        <Heading
          title="Reglas de fila"
          right={
            <Link
              href="/subsidiary-manager/queue-rules/new"
              aria-label="Agregar regla"
              className={cn(buttonVariants({ variant: 'default' }), 'hidden lg:flex')}
            >
              <Plus />
              Agregar regla
            </Link>
          }
        />
        <Separator />
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reglas Activas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...timeRules, ...absenceRules, ...priorityRules].filter((r) => r.status === 'Activa').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {[...timeRules, ...absenceRules, ...priorityRules].length} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reglas de Tiempo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeRules.length}</div>
              <p className="text-xs text-muted-foreground">Configuradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reglas de Prioridad</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{priorityRules.length}</div>
              <p className="text-xs text-muted-foreground">Niveles definidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Hoy</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Reglas activadas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="overflow-hidden">
          {isMobile ? (
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar tipo de regla" />
              </SelectTrigger>
              <SelectContent>
                {tabItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <TabsList className="grid w-full grid-cols-3 mb-0">
              <TabsTrigger value="tiempos" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Límites de Tiempo</span>
              </TabsTrigger>
              <TabsTrigger value="ausencias" className="flex items-center space-x-2">
                <UserX className="h-4 w-4" />
                <span>Control de Ausencias</span>
              </TabsTrigger>
              <TabsTrigger value="prioridad" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Niveles de Prioridad</span>
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="tiempos" className="space-y-4 overflow-hidden">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="h-5 w-5 mr-2" />
                  Reglas de Límites de Tiempo
                </CardTitle>
                <CardDescription>
                  Configuración de tiempos máximos para atención, espera y alertas preventivas. Estas reglas se
                  activan cuando se superan los límites establecidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Regla</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Acciones</TableHead>
                      <TableHead>Opciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getRulesByType('tiempos').map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-muted-foreground">{rule.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {rule.value} {rule.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(rule.status ?? '')}>
                            {rule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(rule.priority ?? '')}>
                            {rule.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {rule.actions && rule.actions.map((action, index) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                • {action}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <abbr title="Editar">
                              <Link href={'/subsidiary-manager/queue-rules/edit/1'} className={cn(buttonVariants({ variant:'ghost', size: 'sm' }))}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </abbr>
                            <abbr title="Eliminar">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(rule.id || '', rule.name || '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </abbr>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ausencias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserX className="h-5 w-5 mr-2" />
                  Reglas de Ausencias
                </CardTitle>
                <CardDescription>Gestión de ausencias y descansos de operadores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Regla</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Acciones</TableHead>
                      <TableHead>Opciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absenceRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-muted-foreground">{rule.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {rule.value} {rule.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(rule.status ?? '')}>
                            {rule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(rule.priority ?? '')}>
                            {rule.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {rule.actions && rule.actions.map((action, index) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                • {action}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <abbr title="Editar">
                              <Link href={'/subsidiary-manager/queue-rules/edit/1'} className={cn(buttonVariants({ variant:'ghost', size: 'sm' }))}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </abbr>
                            <abbr title="Eliminar">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(rule.id || '', rule.name || '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </abbr>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prioridad" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Reglas de Prioridad
                </CardTitle>
                <CardDescription>Sistema de prioridades para diferentes tipos de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Regla</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Criterio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                      <TableHead>Opciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priorityRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-muted-foreground">{rule.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(rule.priority ?? '')}>
                            Nivel {rule.value}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{rule.criteria}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(rule.status ?? '')}>
                            {rule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {rule.actions && rule.actions.map((action, index) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                • {action}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <abbr title="Editar">
                              <Link href={'/subsidiary-manager/queue-rules/edit/1'} className={cn(buttonVariants({ variant:'ghost', size: 'sm' }))}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </abbr>
                            <abbr title="Eliminar">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(rule.id || '', rule.name || '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </abbr>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la regla{' '}
              <span className="font-semibold">
                {ruleToDelete?.name} (ID: {ruleToDelete?.id})
              </span>{' '}
              y sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
