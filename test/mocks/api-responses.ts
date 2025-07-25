// Mocks para respuestas de API
export const mockApiResponses = {
  metricasGlobales: {
    empresasActivas: 45,
    sucursalesOperativas: 127,
    usuariosAtendidosMes: 15420,
    tiempoPromedioGlobal: 12.5,
  },

  sucursales: [
    { id: 1, nombre: 'Las Condes', estado: 'ACTIVA', ejecutivos: 8 },
    { id: 2, nombre: 'Providencia', estado: 'ACTIVA', ejecutivos: 12 },
  ],

  operadores: [
    { id: 1, nombre: 'Ana Morales', estado: 'ATENDIENDO', eficiencia: 95.2 },
    { id: 2, nombre: 'Pedro Silva', estado: 'DISPONIBLE', eficiencia: 88.7 },
  ],

  colaEstado: {
    posicionActual: 5,
    tiempoEstimado: 18,
    turnoEnAtencion: 'A010',
  },
};

// Mock de servicios
export const mockServices = {
  metricasService: {
    obtenerMetricasGlobales: jest.fn().mockResolvedValue(mockApiResponses.metricasGlobales),
    contarEmpresasActivas: jest.fn().mockResolvedValue(true),
    calcularTiempoPromedioGlobal: jest.fn().mockResolvedValue(true),
  },

  supervisionService: {
    obtenerEstadoSucursales: jest.fn().mockResolvedValue(mockApiResponses.sucursales),
    identificarUbicacionesActivas: jest.fn().mockResolvedValue(true),
  },

  colaService: {
    registrarUsuario: jest.fn().mockResolvedValue(true),
    obtenerEstadoCola: jest.fn().mockResolvedValue(mockApiResponses.colaEstado),
  },
};
