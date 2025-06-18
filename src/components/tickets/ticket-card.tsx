import { cn } from '@/lib/utils';
import { Ticket, getTicketInfo, TicketStatus } from '@/types/ticket';
import { Separator } from '@radix-ui/react-separator';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building, Zap, X, Loader2 } from 'lucide-react';
import { STATUS_LABELS } from '@/services/tickets';
import { InfoGrid } from './info-grid';
import { useSSEGlobalState } from '@/hooks/use-sse';
import { useEffect, useState } from 'react';

interface TicketCardProps {
  readonly shift: Ticket;
  readonly onCancel?: (shift: Ticket) => void;
  readonly isHistory?: boolean;
}

function StatusBadge({ status }: { readonly status: TicketStatus }) {
  const statusConfig = STATUS_LABELS[status];
  if (!statusConfig) {
    return (
      <Badge className='bg-muted text-muted-foreground'>Desconocido</Badge>
    );
  }
  const { label, className } = statusConfig;
  return (
    <Badge className={cn('border font-medium text-xs px-2 py-1', className)}>
      {label}
    </Badge>
  );
}

function TicketNumber({
  ticketNumber,
  isHistory,
}: {
  readonly ticketNumber: string | number;
  readonly isHistory?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl px-4 py-3 sm:px-5 text-center',
        isHistory
          ? 'bg-muted border-2 border-border'
          : 'bg-gradient-to-br from-primary/15 to-secondary/25 border-2 border-primary/30',
      )}
    >
      <div className='relative'>
        <div
          className={cn(
            'text-2xl sm:text-3xl font-black',
            isHistory ? 'text-muted-foreground' : 'text-primary',
          )}
        >
          {ticketNumber}
        </div>
        <div className='text-xs font-medium text-muted-foreground mt-1'>
          {isHistory ? 'Finalizado' : 'Tu número'}
        </div>
      </div>
    </div>
  );
}

function CurrentAttention({
  currentTicket,
  isSSEConnected,
  isLoading,
}: {
  readonly currentTicket: number | null;
  readonly isSSEConnected?: boolean;
  readonly isLoading?: boolean;
}) {
  let content;
  if (isLoading) {
    content = (
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='w-8 h-8 animate-spin text-success' />
        <div className='text-xs text-success/70 font-normal'>
          Obteniendo número actual...
        </div>
      </div>
    );
  } else if (currentTicket !== null) {
    content = (
      <div className='flex flex-col items-center'>
        <div className='transition-all duration-300' key={currentTicket}>
          {currentTicket}
        </div>
        <div className='text-base font-semibold text-success/80 mt-1'>
          Número actual en atención
          <span className='inline-block w-6 text-left'>
            <span className='animate-pulse'>.</span>
            <span className='animate-pulse' style={{ animationDelay: '0.33s' }}>
              .
            </span>
            <span className='animate-pulse' style={{ animationDelay: '0.66s' }}>
              .
            </span>
          </span>
        </div>
      </div>
    );
  } else {
    content = (
      <div className='flex flex-col items-center gap-2'>
        <div className='text-2xl text-success/50'>—</div>
        <div className='text-xs text-success/70 font-normal'>
          Sin atención activa
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden rounded-xl bg-gradient-to-r from-success/5 to-secondary/5 border border-success/20 p-4 sm:p-5'>
      <div className='relative text-center'>
        <div className='text-3xl sm:text-4xl font-black text-success mb-1 min-h-[3rem] flex items-center justify-center'>
          {content}
        </div>
      </div>
    </div>
  );
}
export function TicketCard({ shift, onCancel, isHistory }: TicketCardProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const { isConnected, activeTicketId, currentTicketNumber, lastEvent } =
    useSSEGlobalState();

  const isSSEConnected = isConnected && activeTicketId === shift.id?.toString();

  useEffect(() => {
    if (!isHistory) {
      setIsInitialLoading(true);
      if (loadingTimeout) clearTimeout(loadingTimeout);
      const timeout = setTimeout(() => {
        setIsInitialLoading(false);
        setLoadingTimeout(null);
      }, 1500);
      setLoadingTimeout(timeout);
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift.id, isHistory]);

  useEffect(() => {
    if (currentTicketNumber !== null && isInitialLoading) {
      setIsInitialLoading(false);
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
    }
  }, [currentTicketNumber, isInitialLoading, loadingTimeout]);

  const ticketInfo = shift.queue ? getTicketInfo(shift) : null;
  const serviceName =
    ticketInfo?.serviceName || shift.serviceModuleId || 'Servicio General';
  const siteName = ticketInfo?.branchName || 'Sucursal Principal';
  const companyName = ticketInfo?.companyName || 'Empresa Principal';
  const serviceDescription = ticketInfo?.serviceDescription || serviceName;

  const shouldShowLoader = !isHistory && isInitialLoading;
  const currentTicketBeingServed = shouldShowLoader
    ? null
    : currentTicketNumber;

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card/50 to-card',
        isHistory && 'opacity-75 grayscale',
        isSSEConnected &&
          !isHistory &&
          'ring-2 ring-success/30 shadow-success/20',
      )}
    >
      <CardHeader className='pb-4 bg-gradient-to-r from-primary/5 to-secondary/5'>
        <div className='space-y-4'>
          <div className='hidden sm:flex items-center justify-between'>
            <div className='flex items-center gap-4 flex-1 min-w-0'>
              <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center flex-shrink-0'>
                <Building className='w-7 h-7 text-primary' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='font-bold text-lg text-heading-foreground truncate'>
                    {companyName}
                  </h3>
                  <StatusBadge status={shift.status} />
                </div>
                <div className='mb-1'>
                  <h4 className='font-semibold text-base text-foreground truncate'>
                    {siteName}
                  </h4>
                </div>
                <div className='text-sm text-muted-foreground truncate'>
                  {serviceDescription}
                </div>
              </div>
            </div>
            <TicketNumber
              ticketNumber={shift.ticketNumber}
              isHistory={isHistory}
            />
          </div>
          <div className='sm:hidden space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center flex-shrink-0'>
                <Building className='w-6 h-6 text-primary' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='font-bold text-base text-heading-foreground truncate'>
                    {companyName}
                  </h3>
                  <StatusBadge status={shift.status} />
                </div>
                <div className='mb-1'>
                  <h4 className='font-medium text-sm text-foreground truncate'>
                    {siteName}
                  </h4>
                </div>
                <div className='text-xs text-muted-foreground truncate'>
                  {serviceDescription}
                </div>
              </div>
            </div>
            <div className='flex justify-center'>
              <TicketNumber
                ticketNumber={shift.ticketNumber}
                isHistory={isHistory}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-4 sm:p-6'>
        <div className='space-y-4 sm:space-y-5'>
          {!isHistory && (
            <CurrentAttention
              currentTicket={currentTicketBeingServed}
              isSSEConnected={isSSEConnected && !shouldShowLoader}
              isLoading={shouldShowLoader}
            />
          )}
          <InfoGrid
            isHistory={isHistory}
            shift={shift}
            createdAt={shift.createdAt}
          />
          {!isHistory && (
            <>
              <Separator className='bg-border' />
              <div className='flex items-center justify-between'>
                {shouldShowLoader && (
                  <div className='flex items-center gap-2 text-xs text-yellow-600'>
                    <Loader2 className='w-3 h-3 animate-spin' />
                    <span>Conectando...</span>
                  </div>
                )}

                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => onCancel?.(shift)}
                  className={cn(
                    (isSSEConnected || shouldShowLoader) && 'ml-auto',
                  )}
                  disabled={shouldShowLoader}
                >
                  <X className='w-4 h-4 mr-2' />
                  Cancelar turno
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
