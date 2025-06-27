// ============================================
// ARCHIVO: services/sse/sse-connection.service.ts
// ============================================

import { ENV } from '@/lib/env';
import { CONNECTION_STATES } from '@/lib/sse/constants';
import { SSEConnectionConfig, ISSEConnection, SSEEventData } from './types';

export class SSEConnectionService implements ISSEConnection {
  private eventSource: EventSource | null = null;
  private config: SSEConnectionConfig;

  constructor(config: SSEConnectionConfig) {
    this.config = config;
  }

  connect(): void {
    if (this.isConnected()) {
      this.disconnect();
    }

    this.eventSource = new EventSource(`${ENV.API_URL}${this.config.url}`, {
      withCredentials: this.config.withCredentials ?? true,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === CONNECTION_STATES.OPEN;
  }

  getReadyState(): number {
    return this.eventSource?.readyState ?? CONNECTION_STATES.CLOSED;
  }

  private setupEventListeners(): void {
    if (!this.eventSource) return;

    this.eventSource.onopen = () => {
      this.config.onOpen?.();
    };

    this.eventSource.onmessage = (event) => {
      const data = this.parseEventData(event.data);
      if (data) {
        this.config.onMessage?.(data);
      }
    };

    this.eventSource.onerror = (error) => {
      this.config.onError?.(error);
    };
  }

  private parseEventData(data: string): SSEEventData | null {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
