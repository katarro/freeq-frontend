import * as React from 'react';
import {
  UserIcon,
  BellIcon,
  HelpIcon,
  PhoneIcon,
  LogOutIcon,
  TimeIcon,
  HeartIcon,
  BuildIcon,
} from '@/components/ui/icons';
import { ProfileIcon } from '@/components/ui/icons/profile-icon';
import { ListIcon } from 'lucide-react';

type NavigationGroup = {
  title: string;
  items: NavigationLink[];
};

type NavigationLink = {
  title: string;
  url: string;
  icon?: React.ComponentType;
};

export const navigationGroups: NavigationGroup[] = [
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
