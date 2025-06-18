export interface SSEEvent {
  type: string;
  currentTicketNumber?: number;
  ticketNumber?: number;
  estimatedWaitTime?: number;
  moduleCode?: string;
  message?: string;
  error?: string;
  data?: any;
}
