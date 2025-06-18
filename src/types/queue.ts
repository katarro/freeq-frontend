export interface Queue {
  id: string;
  name: string;
  serviceTypeName: string;
  serviceTypeCode: string;
  isActive: boolean;
  description: string;
  demandLevel: string;
  currentPeopleInQueue: number;
  estimatedWaitTimeMinutes: number;
}
