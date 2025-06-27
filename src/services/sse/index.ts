// ============================================
// ARCHIVO: services/sse/index.ts
// ============================================

export { SSEConnectionService } from './sse-connection.service';
export {
  QueueUpdateEventHandler,
  TicketCompletedEventHandler,
  ErrorEventHandler,
  SSEEventDispatcher,
} from './sse-event-handlers';
export type {
  SSEEventData,
  QueueUpdateEvent,
  TicketCompletedEvent,
  SSEErrorEvent,
  SSEConnectionConfig,
  ISSEConnection,
  ISSEEventHandler,
} from './types';
