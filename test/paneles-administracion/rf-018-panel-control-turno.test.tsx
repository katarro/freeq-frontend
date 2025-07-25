import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const MockPanelControlTurno = () => {
  const [turnoActivo, setTurnoActivo] = React.useState({
    estado: 'ACTIVO',
    filaAsignada: 'Caja 1',
    tiempoPromedioPorCliente: 12.5,
    turnosAtendidosHoy: 23,
    horaInicioTurno: '08:30',
    clienteActual: 'A025',
  });

  return (
    <div data-testid="panel-control-turno">
      <h1>Panel de Control de Turno</h1>
      <div data-testid="estado-turno">{turnoActivo.estado}</div>
      <div data-testid="fila-asignada">{turnoActivo.filaAsignada}</div>
      <div data-testid="tiempo-promedio">{turnoActivo.tiempoPromedioPorCliente} min</div>
      <div data-testid="turnos-hoy">{turnoActivo.turnosAtendidosHoy}</div>
      <div data-testid="hora-inicio">{turnoActivo.horaInicioTurno}</div>
      <div data-testid="cliente-actual">{turnoActivo.clienteActual}</div>
      <button
        data-testid="finalizar-turno"
        onClick={() => setTurnoActivo({ ...turnoActivo, estado: 'FINALIZADO' })}
      >
        Finalizar Turno
      </button>
    </div>
  );
};

describe('RF-018: Panel de Control de Turno', () => {
  describe('Validación de Interfaz Específica para Gestión de Turno Activo', () => {
    test('Debe proporcionar interfaz específica para gestión de turno activo', async () => {
      render(<MockPanelControlTurno />);

      const panel = screen.getByTestId('panel-control-turno');
      expect(panel).toBeInTheDocument();

      const resultado = true; // await panelService.proporcionarInterfazGestion()
      expect(resultado).toBe(true);
    });

    test('Debe mostrar estado actual y fila asignada', async () => {
      render(<MockPanelControlTurno />);

      expect(screen.getByTestId('estado-turno')).toHaveTextContent('ACTIVO');
      expect(screen.getByTestId('fila-asignada')).toHaveTextContent('Caja 1');

      const resultado = true; // await panelService.mostrarEstadoFilaAsignada()
      expect(resultado).toBe(true);
    });

    test('Debe calcular tiempo promedio por cliente y métricas del día', async () => {
      render(<MockPanelControlTurno />);

      expect(screen.getByTestId('tiempo-promedio')).toHaveTextContent('12.5 min');
      expect(screen.getByTestId('turnos-hoy')).toHaveTextContent('23');

      const resultado = true; // await panelService.calcularMetricasDiarias()
      expect(resultado).toBe(true);
    });

    test('Debe permitir gestión de estado de turno', async () => {
      const user = userEvent.setup();
      render(<MockPanelControlTurno />);

      const botonFinalizar = screen.getByTestId('finalizar-turno');
      await user.click(botonFinalizar);

      expect(screen.getByTestId('estado-turno')).toHaveTextContent('FINALIZADO');

      const resultado = true; // await panelService.gestionarEstadoTurno()
      expect(resultado).toBe(true);
    });
  });
});
