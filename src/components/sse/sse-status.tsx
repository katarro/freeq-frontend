// components/sse/sse-status.tsx
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SSEStatusProps {
  isConnected: boolean;
  error: string | null;
  activeTicket: any;
}

export function SSEStatus({
  isConnected,
  error,
  activeTicket,
}: Readonly<SSEStatusProps>) {
  if (!activeTicket) {
    return null;
  }

  if (error) {
    return (
      <div className='flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg'>
        <AlertCircle className='w-4 h-4 text-destructive' />
        <span className='text-xs text-destructive font-medium'>{error}</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <Badge
        variant={isConnected ? 'default' : 'secondary'}
        className={`text-xs ${
          isConnected
            ? 'bg-success/10 text-success border-success/20'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className='w-3 h-3 mr-1' />
            Conectado
          </>
        ) : (
          <>
            <WifiOff className='w-3 h-3 mr-1' />
            Desconectado
          </>
        )}
      </Badge>
    </div>
  );
}
