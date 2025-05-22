import { Building, Building2, Timer, Users } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import Overview from '@/app/(private)/super-admin/dashboard/_components/overview';
import RecentStats from '@/app/(private)/super-admin/dashboard/_components/recent-stats';
import CompaniesTable from '@/app/(private)/super-admin/dashboard/_components/companies-table';
import { columns } from '@/app/(private)/super-admin/dashboard/_components/companies-table/columns';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { CompanyValues } from '@/lib/schemas';

const empresas: CompanyValues[] = [
  { name: 'Banco Estado', subsidiaries: 45, users: 2340, state: 'Activo' },
  { name: 'Registro Civil', subsidiaries: 32, users: 1890, state: 'Activo' },
  { name: 'Jumbo', subsidiaries: 28, users: 1450, state: 'Activo' },
  { name: 'Clínica Santa María', subsidiaries: 12, users: 980, state: 'Activo' },
  { name: 'Municipalidad Santiago', subsidiaries: 8, users: 750, state: 'Activo' },
];

export default function DashboardPage () {
  return (
    <section className="grid gap-4">
      <h1 className="heading-01">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empresas
            </CardTitle>
            <Building2 className="w-5 h-5 text-muted-foreground"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-success">
              ↑ 12% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sucursales
            </CardTitle>
            <Building className="w-5 h-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-sm text-success">
              ↑ 8% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="w-5 h-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,549</div>
            <p className="text-sm text-success">
              ↑ 24% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Timer className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 min</div>
            <p className="text-sm text-destructive">
              ↓ 15% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_0.7fr]">
        <Card className="">
          <CardHeader>
            <CardTitle>Visión General</CardTitle>
            <CardDescription>Número total de usuarios atendidos por mes</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Registro de actividad
            </CardTitle>
            <CardDescription>
              Últimas acciones realizadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentStats />
          </CardContent>
          <CardFooter>
            <Link href="/super-admin/activity-logs/" className={cn(buttonVariants({ variant: 'link' }), 'w-fit shadow-none mx-auto underline')}>
              Ver más
            </Link>
          </CardFooter>
        </Card>
      </div>
      <Card className="grid">
        <CardHeader>
          <CardTitle>Últimas empresas activas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <CompaniesTable columns={columns} data={empresas}/>
        </CardContent>
        <CardFooter>
          <Link href="/super-admin/companies/" className={cn(buttonVariants({ variant: 'link' }), 'mx-auto shadow-none underline')}>
            Ver más
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
