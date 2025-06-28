// types/ticket.ts

export type TicketStatus =
  | 'WAITING'
  | 'CALLED'
  | 'ATTENDING'
  | 'COMPLETED'
  | 'ABSENT'
  | 'POSTPONED'
  | 'CANCELLED';

export interface OperatorTicketStatus {
  operatorId: string;
  status: TicketStatus;
  currentClient: number | null;
  queueCount: number;
  canTakeNext: boolean;
  lastAction: 'completed' | 'absent' | 'none';
  isLoading?: boolean;
}

export interface AttendanceHistory {
  id: number;
  client: string;
  startTime: string;
  endTime: string;
  duration: string;
  satisfaction: number;
  operatorId: string;
}

export type EntryType = 'VIRTUAL' | 'PHYSICAL' | 'MIXED';

export type SyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';

// Renamed to avoid conflict with TicketStatus type above

// Interfaces para las relaciones
export interface Company {
  id: string;
  name: string;
  rut: string;
  address: string;
  phone: string | null;
  email: string;
  website: string | null;
  logo: string | null;
  description: string | null;
  adminId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  address: string;
  phone: string | null;
  adminId: string;
  isActive: boolean;
  offlineMode: boolean;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

export interface ServiceType {
  id: string;
  branchId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  code: string;
}

export interface Queue {
  id: string;
  name: string;
  branchId: string;
  serviceModuleId: string;
  serviceTypeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  branch: Branch;
  serviceType: ServiceType;
}

// Interfaz principal del Ticket
export interface Ticket {
  id: string;
  queueId: string;
  userId: string;
  serviceModuleId: string;
  executiveId: string | null;
  anonymousEmail: string | null;
  anonymousPhone: string | null;
  registrationToken: string | null;
  ticketNumber: number;
  estimatedWaitTime: number;
  priorityLevel: number;
  status: TicketStatus;
  entryTime: string;
  callTime: string | null;
  serviceTime: string | null;
  endTime: string | null;
  entryType: EntryType;
  createdOffline: boolean;
  syncStatus: SyncStatus;
  absenceCount: number;
  createdAt: string;
  updatedAt: string;
  moduleCode: string;
  queue: Queue; // 👈 Relación completa con queue
  executiveName: string | null;
  currentTicketNumber: number | null;
}

// Interfaz simplificada para casos donde no necesites todas las relaciones
export interface SimpleTicket {
  id: string;
  queueId: string;
  userId: string;
  ticketNumber: number;
  estimatedWaitTime: number;
  status: TicketStatus;
  entryTime: string;
  createdAt: string;
  moduleCode: string;
}

// Helpers para extraer información común
export interface TicketInfo {
  serviceName: string;
  branchName: string;
  companyName: string;
  branchAddress: string;
  serviceDescription: string;
  serviceCode: string;
}

// Función helper para extraer información del ticket
export function getTicketInfo(ticket: Ticket): TicketInfo {
  return {
    serviceName: ticket.queue.serviceType.name,
    branchName: ticket.queue.branch.name,
    companyName: ticket.queue.branch.company.name,
    branchAddress: ticket.queue.branch.address,
    serviceDescription: ticket.queue.serviceType.description,
    serviceCode: ticket.queue.serviceType.code,
  };
}
