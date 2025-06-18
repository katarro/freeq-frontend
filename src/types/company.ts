export interface Company {
  id: string;
  name: string;
  rut: string;
  address: string;
  phone: string;
  email: string;
  website?: string | null;
  logo?: string | null;
  description?: string | null;
  adminId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
