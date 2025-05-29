'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../actions/mode-toggle';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rut: string;
  avatar?: string;
  dateOfBirth: string;
  address: string;
  city: string;
  region: string;
  role:
    | 'user'
    | 'operator'
    | 'super-admin'
    | 'company-administrator'
    | 'subsidiary-manager';
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    language: string;
    theme: string;
  };
  stats: {
    totalTickets: number;
    completedTickets: number;
    cancelledTickets: number;
    averageWaitTime: number;
    favoriteLocations: number;
  };
}

interface ProfilePageProps {
  readonly userRole:
    | 'user'
    | 'operator'
    | 'super-admin'
    | 'company-administrator'
    | 'subsidiary-manager';
}

export default function ProfilePage({ userRole }: ProfilePageProps) {
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    firstName: 'Juan Carlos',
    lastName: 'Pérez González',
    email: 'juan.perez@email.com',
    phone: '+56 9 8765 4321',
    rut: '12.345.678-9',
    avatar: '',
    dateOfBirth: '1985-03-15',
    address: 'Av. Libertador 1234',
    city: 'Santiago',
    region: 'Región Metropolitana',
    role: userRole, // Asignar el rol recibido
    preferences: {
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      language: 'es',
      theme: 'system',
    },
    stats: {
      totalTickets: 45,
      completedTickets: 38,
      cancelledTickets: 7,
      averageWaitTime: 18,
      favoriteLocations: 5,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('preferences.')) {
      const prefField = field.split('.')[1];
      setUser((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      user: 'Usuario',
      operator: 'Operador',
      'super-admin': 'Super Administrador',
      'company-administrator': 'Administrador de Empresa',
      'subsidiary-manager': 'Gerente de Sucursal',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      operator: 'bg-green-100 text-green-800',
      'super-admin': 'bg-purple-100 text-purple-800',
      'company-administrator': 'bg-orange-100 text-orange-800',
      'subsidiary-manager': 'bg-indigo-100 text-indigo-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCompletionRate = () => {
    return Math.round(
      (user.stats.completedTickets / user.stats.totalTickets) * 100,
    );
  };

  const shouldShowStats = () => {
    // Solo mostrar estadísticas a usuarios normales y operadores
    return userRole === 'user' || userRole === 'operator';
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <section className='bg-gradient-to-bl from-secondary to-primary p-6'>
        <div className='container max-w-4xl mx-auto'>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <Avatar className='w-20 h-20 border-4 border-white/20'>
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className='text-2xl font-semibold bg-white/20 text-primary-foreground'>
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className='text-center sm:text-left'>
              <h1 className='text-2xl font-semibold text-primary-foreground'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='text-primary-foreground/80'>{user.email}</p>
              <p className='text-primary-foreground/80'>RUT: {user.rut}</p>
              <Badge className={`mt-2 ${getRoleBadgeColor(userRole)}`}>
                {getRoleDisplayName(userRole)}
              </Badge>
            </div>
            <div className='sm:ml-auto'>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant='outline'
                className='bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20'
              >
                {isEditing ? 'Cancelar' : 'Editar perfil'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className='container max-w-4xl mx-auto px-4 py-6'>
        <Tabs defaultValue='personal' className='space-y-6'>
          <TabsList
            className={`grid w-full ${shouldShowStats() ? 'grid-cols-4' : 'grid-cols-3'}`}
          >
            <TabsTrigger value='personal'>Personal</TabsTrigger>
            <TabsTrigger value='preferences'>Preferencias</TabsTrigger>
            {shouldShowStats() && (
              <TabsTrigger value='stats'>Estadísticas</TabsTrigger>
            )}
            <TabsTrigger value='security'>Seguridad</TabsTrigger>
          </TabsList>

          {/* Información Personal */}
          <TabsContent value='personal' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>Nombre</Label>
                    <Input
                      id='firstName'
                      value={user.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Apellido</Label>
                    <Input
                      id='lastName'
                      value={user.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={user.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Teléfono</Label>
                    <Input
                      id='phone'
                      value={user.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='dateOfBirth'>Fecha de nacimiento</Label>
                  <Input
                    id='dateOfBirth'
                    type='date'
                    value={user.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange('dateOfBirth', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className='space-y-4'>
                  <h3 className='text-lg font-medium'>Dirección</h3>
                  <div className='space-y-2'>
                    <Label htmlFor='address'>Dirección</Label>
                    <Input
                      id='address'
                      value={user.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='city'>Ciudad</Label>
                      <Input
                        id='city'
                        value={user.city}
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='region'>Región</Label>
                      <Select
                        value={user.region}
                        onValueChange={(value) =>
                          handleInputChange('region', value)
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Región Metropolitana'>
                            Región Metropolitana
                          </SelectItem>
                          <SelectItem value='Región de Valparaíso'>
                            Región de Valparaíso
                          </SelectItem>
                          <SelectItem value='Región del Biobío'>
                            Región del Biobío
                          </SelectItem>
                          <SelectItem value='Región de La Araucanía'>
                            Región de La Araucanía
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className='flex gap-2 pt-4'>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className='flex-1'
                    >
                      {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setIsEditing(false)}
                      className='flex-1'
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferencias */}
          <TabsContent value='preferences' className='space-y-6'>
            {/* Solo mostrar notificaciones a usuarios normales */}
            {userRole === 'user' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Notificaciones push</Label>
                      <p className='text-sm text-muted-foreground'>
                        Recibir notificaciones cuando sea tu turno
                      </p>
                    </div>
                    <Switch
                      checked={user.preferences.notifications}
                      onCheckedChange={(checked) =>
                        handleInputChange('preferences.notifications', checked)
                      }
                    />
                  </div>
                  <Separator />
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Alertas por email</Label>
                      <p className='text-sm text-muted-foreground'>
                        Recibir recordatorios por correo electrónico
                      </p>
                    </div>
                    <Switch
                      checked={user.preferences.emailAlerts}
                      onCheckedChange={(checked) =>
                        handleInputChange('preferences.emailAlerts', checked)
                      }
                    />
                  </div>
                  <Separator />
                  <div className='flex items-center justify-between'>
                    <div>
                      <Label>Alertas por SMS</Label>
                      <p className='text-sm text-muted-foreground'>
                        Recibir mensajes de texto cuando sea tu turno
                      </p>
                    </div>
                    <Switch
                      checked={user.preferences.smsAlerts}
                      onCheckedChange={(checked) =>
                        handleInputChange('preferences.smsAlerts', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Configuración de la app</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='language'>Idioma</Label>
                  <Select
                    value={user.preferences.language}
                    onValueChange={(value) =>
                      handleInputChange('preferences.language', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='es'>Español</SelectItem>
                      <SelectItem value='en'>English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Toggle de tema integrado */}
                <div className='flex items-center justify-between'>
                  <div>
                    <Label>Tema de la aplicación</Label>
                    <p className='text-sm text-muted-foreground'>
                      Cambiar entre modo claro, oscuro o automático
                    </p>
                  </div>
                  <ModeToggle />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Estadísticas - Solo para user y operator */}
          {shouldShowStats() && (
            <TabsContent value='stats' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Card>
                  <CardContent className='p-6 text-center'>
                    <div className='text-2xl font-bold text-primary'>
                      {user.stats.totalTickets}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Total de turnos
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-6 text-center'>
                    <div className='text-2xl font-bold text-success'>
                      {user.stats.completedTickets}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Completados
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-6 text-center'>
                    <div className='text-2xl font-bold text-destructive'>
                      {user.stats.cancelledTickets}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Cancelados
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className='p-6 text-center'>
                    <div className='text-2xl font-bold text-primary'>
                      {getCompletionRate()}%
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Tasa de éxito
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Análisis de uso</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span>Tiempo promedio de espera</span>
                    <Badge variant='outline'>
                      {user.stats.averageWaitTime} min
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Ubicaciones favoritas</span>
                    <Badge variant='outline'>
                      {user.stats.favoriteLocations}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Tasa de completitud</span>
                    <Badge
                      variant='outline'
                      className={cn(
                        getCompletionRate() >= 80
                          ? 'text-success border-success'
                          : 'text-warning border-warning',
                      )}
                    >
                      {getCompletionRate()}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Seguridad */}
          <TabsContent value='security' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Cambiar contraseña</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='currentPassword'>Contraseña actual</Label>
                  <Input id='currentPassword' type='password' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>Nueva contraseña</Label>
                  <Input id='newPassword' type='password' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>
                    Confirmar nueva contraseña
                  </Label>
                  <Input id='confirmPassword' type='password' />
                </div>
                <Button className='w-full'>Cambiar contraseña</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
