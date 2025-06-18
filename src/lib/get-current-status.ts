import { SiteStatus } from '@/components/cards/site-card';

export const getCurrentStatus = (status: SiteStatus): string => {
  switch (status) {
    case SiteStatus.AVAILABLE:
      return 'Disponible';
    case SiteStatus.HIGH_DEMAND:
      return 'Alta demanda';
    case SiteStatus.CLOSED:
      return 'Cerrado';
    default:
      return 'Disponible';
  }
};
