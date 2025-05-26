import {
  BellIcon,
  BuildIcon,
  HeartIcon,
  HelpIcon,
  LogOutIcon,
  PhoneIcon,
  TimeIcon,
  UserIcon,
} from '@/components/ui/icons';
import {
  BookText,
  Building2, ChartArea,
  ChartColumnDecreasing,
  FileText,
  Globe,
  LayoutDashboard,
  ListIcon,
  Settings, Store,
  Users,
} from 'lucide-react';
import { ProfileIcon } from '@/components/ui/icons/profile-icon';
import { ComponentType } from 'react';

export type NavigationGroup = {
  title?: string;
  items: NavigationLink[];
};

export type NavigationLink = {
  title: string;
  url: string;
  icon?: ComponentType<{ className?: string }>;
};

export const clientNavigation: NavigationGroup[] = [
  {
    title: 'Mis turnos',
    items: [
      {
        title: 'Mi turno actual',
        url: '#',
        icon: UserIcon,
      },
      {
        title: 'Mis turnos anteriores',
        url: '#',
        icon: TimeIcon,
      },
    ],
  },
  {
    title: 'Lugares',
    items: [
      {
        title: 'Sitios favoritos',
        url: '?filter=favorites',
        icon: HeartIcon,
      },
      {
        title: 'Sucursales abiertas',
        url: '?filter=open',
        icon: BuildIcon,
      },
      {
        title: 'Mostrar todas',
        url: '?filter=all',
        icon: ListIcon,
      },
    ],
  },
  {
    title: 'Notificaciones y ayuda',
    items: [
      {
        title: 'Notificaciones',
        url: '#',
        icon: BellIcon,
      },
      {
        title: 'Preguntas frecuentes',
        url: '#',
        icon: HelpIcon,
      },
      {
        title: 'Contacto',
        url: 'https://api.whatsapp.com/send?phone=56965004665&text=Hola%2C+%F0%9F%91%8B+%0A%0ALe+escribo+desde+FreeQ%2C+tengo+una+consulta+sobre+la+aplicaci%C3%B3n.%0ATengo+una+consulta.+%0A%0A%C2%A1Gracias%21+%F0%9F%99%8C%22',
        icon: PhoneIcon,
      },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      {
        title: 'Ver perfil',
        url: '/admin/profile',
        icon: ProfileIcon,
      },
      {
        title: 'Cerrar sesión',
        url: '#',
        icon: LogOutIcon,
      },
    ],
  },
];

export const superAdminNavigation: NavigationGroup[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        url: '/super-admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Logs de actividad',
        url: '/super-admin/activity-logs',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Gestión de Entidades',
    items: [
      {
        title: 'Empresas',
        url: '/super-admin/companies',
        icon: Building2,
      },
      {
        title: 'Administradores',
        url: '/super-admin/administrators',
        icon: Users,
      },
    ],
  },
  {
    title: 'Herramientas y Configuración',
    items: [
      {
        title: 'Parámetros globales',
        url: '/super-admin/global-parameters',
        icon: Globe,
      },
      {
        title: 'Configuración avanzada',
        url: '/super-admin/advanced-configuration',
        icon: Settings,
      },
    ],
  },
];

export const companyAdministratorNavigation: NavigationGroup[] = [
  {
    items: [
      {
        title: 'KPIs',
        url: '/company-administrator/kpis',
        icon: ChartColumnDecreasing,
      },
      {
        title: 'Sucursales',
        url: '/company-administrator/subsidiaries/',
        icon: Store,
      },
      {
        title: 'Jefes de sucursal',
        url: '/company-administrator/subsidiaries-managers/',
        icon: Users,
      },
      {
        title: 'Parámetros',
        url: '/company-administrator/parameters',
        icon: Settings,
      },
      {
        title: 'Encuestas',
        url: '/company-administrator/surveys',
        icon: BookText,
      },
    ],
  },
];

export const subsidiaryManagerNavigation: NavigationGroup[] = [
  {
    items: [
      {
        title: 'Panel principal',
        url: '/subsidiary-manager/main-panel',
        icon: ChartColumnDecreasing,
      },
      {
        title: 'Ejecutivos',
        url: '/subsidiary-manager/operators/',
        icon: Store,
      },
      {
        title: 'Configuración de cajas',
        url: '/subsidiary-manager/boxes-configuration',
        icon: Users,
      },
      {
        title: 'Reglas de fila',
        url: '/subsidiary-manager/queue-rules',
        icon: Settings,
      },
      {
        title: 'Resultados de encuestas',
        url: '/subsidiary-manager/survey-results',
        icon: BookText,
      },
    ],
  },
];

export const operatorNavigation: NavigationGroup[] = [
  {
    items: [
      {
        title: 'Panel principal',
        url: '/operator/main-panel',
        icon: LayoutDashboard,
      },
      {
        title: 'My turno',
        url: '/operator/my-turn/',
        icon: Store,
      },
      {
        title: 'Estadísticas',
        url: '/operator/statistics',
        icon: ChartArea,
      },
    ],
  },
];
