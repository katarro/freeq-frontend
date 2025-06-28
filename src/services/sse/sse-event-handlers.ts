// ============================================
// ARCHIVO: services/sse/sse-event-handlers.ts
// ============================================

import { toast } from 'sonner';
import { SSE_EVENTS } from '@/lib/sse/constants';
import {
  ISSEEventHandler,
  SSEEventData,
  QueueUpdateEvent,
  TicketCompletedEvent,
  SSEErrorEvent,
} from './types';

export class QueueUpdateEventHandler implements ISSEEventHandler {
  constructor(private onCountUpdate: (count: number) => void) {}

  canHandle(eventType: string): boolean {
    return eventType === SSE_EVENTS.QUEUE_UPDATE_EVENT;
  }

  handleEvent(data: SSEEventData): void {
    const event = data as QueueUpdateEvent;
    this.onCountUpdate(event.clientsInQueue);
  }
}

export class TicketCompletedEventHandler implements ISSEEventHandler {
  constructor(
    private executiveId: string,
    private onTicketCompleted: (count: number) => void,
  ) {}

  canHandle(eventType: string): boolean {
    return eventType === SSE_EVENTS.TICKET_COMPLETED_EVENT;
  }

  handleEvent(data: SSEEventData): void {
    const event = data as TicketCompletedEvent;

    if (event.executiveId !== this.executiveId) {
      return;
    }

    const newCount = event.myCompletedToday;
    this.onTicketCompleted(newCount);
  }
}

export class ErrorEventHandler implements ISSEEventHandler {
  canHandle(eventType: string): boolean {
    return eventType === SSE_EVENTS.ERROR;
  }

  handleEvent(data: SSEEventData): void {
    const event = data as SSEErrorEvent;
    toast.error(`Error: ${event.message}`);
  }
}

export class SSEEventDispatcher {
  private handlers: ISSEEventHandler[] = [];

  addHandler(handler: ISSEEventHandler): void {
    this.handlers.push(handler);
  }

  removeAllHandlers(): void {
    this.handlers = [];
  }

  dispatch(data: SSEEventData): void {
    const handler = this.handlers.find((h) => h.canHandle(data.type));
    if (handler) {
      handler.handleEvent(data);
    }
  }
}
