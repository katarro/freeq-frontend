// ============================================
// ARCHIVO: types/executive.types.ts
// ============================================

export interface ControlPanelData {
  queueInfo: {
    id: string;
    totalWaiting: number;
    regularQueue: number;
    absentQueue: number;
  };
  averageServiceTime: number;
  clientsAttendedToday: number;
  executiveInfo: {
    id: string;
    module: {
      name: string;
      serviceType: string;
    };
  };
  clientsInQueue: Array<{
    status: 'WAITING' | 'CALLED' | 'ATTENDING';
  }>;
}

export interface CompletedTicketsResponse {
  queueId: string;
  executiveId: string;
  count: number;
  date: string;
  message: string;
}

export interface ControlPanelHookReturn {
  data: ControlPanelData | null;
  countUsersInQueue: number;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  connectToQueueCount: () => void;
  connectToMyCompletedTickets: () => void;
  disconnectSSE: () => void;
  getExecutiveStatus: () => string;
  formatTime: (minutes: number) => string;
  myCompletedTicketsToday: number;
}

export type ExecutiveStatus = 'IDLE' | 'AVAILABLE' | 'CALLED' | 'ATTENDING';
export type ClientStatus = 'WAITING' | 'CALLED' | 'ATTENDING';
