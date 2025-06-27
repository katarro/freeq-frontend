// ============================================
// ARCHIVO: services/api/executive-api.service.ts
// ============================================

import apiClient from '@/lib/api-client';
import { ENV } from '@/lib/env';
import { API_ENDPOINTS } from '@/lib/sse/constants';
import {
  ControlPanelData,
  CompletedTicketsResponse,
} from '@/types/executive.type';

interface IExecutiveApiService {
  getControlPanelData(): Promise<ControlPanelData>;
  getMyCompletedTickets(queueId: string): Promise<CompletedTicketsResponse>;
}

class ExecutiveApiService implements IExecutiveApiService {
  private readonly baseUrl = ENV.API_URL;

  private createHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    };
  }

  async getControlPanelData(): Promise<ControlPanelData> {
    try {
      const response = await apiClient.get<ControlPanelData>(
        `${this.baseUrl}${API_ENDPOINTS.CONTROL_PANEL}`,
        { headers: this.createHeaders() },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching control panel data: ${error}`);
    }
  }

  async getMyCompletedTickets(
    queueId: string,
  ): Promise<CompletedTicketsResponse> {
    try {
      const response = await apiClient.get<CompletedTicketsResponse>(
        `${this.baseUrl}${API_ENDPOINTS.MY_COMPLETED_TICKETS(queueId)}`,
        { headers: this.createHeaders() },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching completed tickets: ${error}`);
    }
  }
}

export const executiveApiService = new ExecutiveApiService();
export type { IExecutiveApiService };
