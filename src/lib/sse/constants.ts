// ============================================
// ARCHIVO: lib/sse/constants.ts
// ============================================

export const SSE_EVENTS = {
  QUEUE_UPDATE_EVENT: 'QUEUE_UPDATE_EVENT',
  TICKET_COMPLETED_EVENT: 'TICKET_COMPLETED_EVENT',
  ERROR: 'ERROR',
} as const;

export const CONNECTION_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
} as const;

// Para SSE
export const SSE_ENDPOINTS = {
  QUEUE_COUNT: (queueId: string) =>
    `/eventos-cola/ejecutivo/clientes-en-cola/${queueId}`,
  COMPLETED_TICKETS: (queueId: string, executiveId: string) =>
    `/eventos-cola/ejecutivo/tickets-completados/${queueId}/${executiveId}`,
} as const;

//  Para API REST
export const API_ENDPOINTS = {
  MY_COMPLETED_TICKETS: (queueId: string) =>
    `/ejecutivo/mis-tickets-completados/${queueId}`,
  CONTROL_PANEL: '/ejecutivo/panel-de-control',
} as const;

export const SSE_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  RECONNECT_DELAY: 3000,
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;
