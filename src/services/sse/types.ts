// ============================================
// ARCHIVO: services/sse/types.ts
// ============================================

export interface SSEEventData {
  type: string;
  queueId?: string;
  executiveId?: string;
  ticketId?: string;
  message?: string;
  [key: string]: any;
}

export interface QueueUpdateEvent extends SSEEventData {
  type: 'QUEUE_UPDATE_EVENT';
  queueId: string;
  clientsInQueue: number;
  lastEvent: string;
  currentTicketNumber?: number;
  timestamp: string;
}

export interface TicketCompletedEvent extends SSEEventData {
  type: 'TICKET_COMPLETED_EVENT';
  queueId: string;
  executiveId: string;
  ticketId: string;
  myCompletedToday: number;
  timestamp: string;
}

export interface SSEErrorEvent extends SSEEventData {
  type: 'ERROR';
  message: string;
  timestamp: string;
}

export interface SSEConnectionConfig {
  url: string;
  withCredentials?: boolean;
  onMessage?: (data: SSEEventData) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface ISSEConnection {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
  getReadyState(): number;
}

export interface ISSEEventHandler {
  handleEvent(data: SSEEventData): void;
  canHandle(eventType: string): boolean;
}
