// ============================================
// ARCHIVO: lib/sse/sse-manager.ts
// ============================================

import { toast } from 'sonner';
import { CONNECTION_STATES, SSE_ENDPOINTS } from './constants';
import { SSEConnectionService } from '@/services/sse/sse-connection.service';
import {
  SSEEventDispatcher,
  QueueUpdateEventHandler,
  TicketCompletedEventHandler,
  ErrorEventHandler,
} from '@/services/sse/sse-event-handlers';

interface SSEManagerConfig {
  onQueueCountUpdate: (count: number) => void;
  onTicketCompleted: (count: number) => void;
  executiveId: string;
}

export class SSEManager {
  private queueCountConnection: SSEConnectionService | null = null;
  private completedTicketsConnection: SSEConnectionService | null = null;
  private queueCountDispatcher = new SSEEventDispatcher();
  private completedTicketsDispatcher = new SSEEventDispatcher();
  private config: SSEManagerConfig;

  constructor(config: SSEManagerConfig) {
    this.config = config;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Queue count handlers
    this.queueCountDispatcher.addHandler(
      new QueueUpdateEventHandler(this.config.onQueueCountUpdate),
    );
    this.queueCountDispatcher.addHandler(new ErrorEventHandler());

    // Completed tickets handlers
    this.completedTicketsDispatcher.addHandler(
      new TicketCompletedEventHandler(this.config.executiveId, this.config.onTicketCompleted),
    );
    this.completedTicketsDispatcher.addHandler(new ErrorEventHandler());
  }

  connectToQueueCount(queueId: string): void {
    if (this.queueCountConnection) {
      this.queueCountConnection.disconnect();
    }

    this.queueCountConnection = new SSEConnectionService({
      url: SSE_ENDPOINTS.QUEUE_COUNT(queueId),
      onMessage: (data) => this.queueCountDispatcher.dispatch(data),
      onError: this.handleConnectionError,
    });

    this.queueCountConnection.connect();
  }

  connectToCompletedTickets(queueId: string): void {
    if (this.completedTicketsConnection) {
      this.completedTicketsConnection.disconnect();
    }

    this.completedTicketsConnection = new SSEConnectionService({
      url: SSE_ENDPOINTS.COMPLETED_TICKETS(queueId, this.config.executiveId),
      onMessage: (data) => this.completedTicketsDispatcher.dispatch(data),
      onError: this.handleConnectionError,
    });

    this.completedTicketsConnection.connect();
  }

  disconnectAll(): void {
    this.queueCountConnection?.disconnect();
    this.completedTicketsConnection?.disconnect();
    this.queueCountConnection = null;
    this.completedTicketsConnection = null;
  }

  isQueueCountConnected(): boolean {
    return this.queueCountConnection?.isConnected() ?? false;
  }

  isCompletedTicketsConnected(): boolean {
    return this.completedTicketsConnection?.isConnected() ?? false;
  }

  updateExecutiveId(executiveId: string): void {
    this.config.executiveId = executiveId;
    this.completedTicketsDispatcher.removeAllHandlers();
    this.completedTicketsDispatcher.addHandler(
      new TicketCompletedEventHandler(executiveId, this.config.onTicketCompleted),
    );
    this.completedTicketsDispatcher.addHandler(new ErrorEventHandler());
  }

  private handleConnectionError = (event: Event): void => {
    const target = event.target as EventSource;

    if (target.readyState === CONNECTION_STATES.CLOSED) return;
    if (target.readyState === CONNECTION_STATES.CONNECTING) return;

    toast.error('Error de conexión en tiempo real');
  };
}
