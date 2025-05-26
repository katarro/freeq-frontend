import { BoxFormValues } from '@/lib/schemas';

interface QueueConfigData {
  physical: BoxFormValues[];
  virtual: BoxFormValues[];
  mixed: BoxFormValues[];
}

export const queueConfigs: QueueConfigData = {
  physical: [
    {
      id: 'phy-001',
      name: 'Caja Principal 1',
      type: 'physical',
      location: 'Planta Baja, Sector A',
      status: 'Activa',
      priority: 'Muy Alta',
      assignedOperator: 'Juan Pérez',
      currentQueue: 5,
      capacity: 15,
      avgWaitTime: '0:03',
      services: ['Pagos', 'Retiros', 'Consultas'],
      equipment: ['Terminal POS', 'Impresora', 'Escaner'],
    },
    {
      id: 'phy-002',
      name: 'Caja Rápida 2',
      type: 'physical',
      location: 'Planta Baja, Sector B',
      status: 'Inactiva',
      priority: 'Baja',
      assignedOperator: null,
      currentQueue: 0,
      capacity: 10,
      avgWaitTime: '0:00',
      services: ['Pagos Express'],
      equipment: ['Terminal POS'],
    },
  ],
  virtual: [
    {
      id: 'vir-001',
      name: 'Atención Virtual 1',
      type: 'virtual',
      platform: 'Zoom/Teams',
      connectionType: 'Fibra Óptica',
      bandwidth: '500 Mbps',
      status: 'Activa',
      priority: 'Alta',
      assignedOperator: 'María López',
      currentQueue: 3,
      capacity: 20,
      avgWaitTime: '0:05',
      services: ['Asesoría Online', 'Soporte Técnico', 'Ventas'],
      equipment: ['Webcam HD', 'Micrófono Profesional', 'Software CRM'],
    },
    {
      id: 'vir-002',
      name: 'Soporte Remoto',
      type: 'virtual',
      platform: 'AnyDesk',
      connectionType: 'ADSL',
      bandwidth: '50 Mbps',
      status: 'Mantenimiento',
      priority: 'Media',
      assignedOperator: null,
      currentQueue: 0,
      capacity: 10,
      avgWaitTime: '0:00',
      services: ['Diagnóstico Remoto', 'Instalación Software'],
      equipment: ['Software de Acceso Remoto'],
    },
  ],
  mixed: [
    {
      id: 'mix-001',
      name: 'Caja Híbrida 1',
      type: 'mixed',
      physicalLocation: 'Primer Piso',
      virtualPlatform: 'Plataforma Propia',
      flexibleMode: true,
      status: 'Activa',
      priority: 'Muy Alta',
      assignedOperator: 'Carlos Ruiz',
      currentQueue: 8,
      capacity: 25,
      avgWaitTime: '0:04',
      services: ['Pagos', 'Retiros', 'Asesoría Mixta'],
      equipment: ['Terminal POS', 'Webcam', 'Micrófono'],
    },
  ],
};
