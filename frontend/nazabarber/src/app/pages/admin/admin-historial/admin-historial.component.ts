import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../../services/turno.service';
import { parseISO, getDay } from 'date-fns';

@Component({
  selector: 'app-admin-historial',
  templateUrl: './admin-historial.component.html',
  styleUrls: ['./admin-historial.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminHistorialComponent implements OnInit {
  turnosPorDiaPasados: { [fecha: string]: any[] } = {};
  turnosPorDiaFuturos: { [fecha: string]: any[] } = {};
  diasPasados: any[] = [];
  diasFuturos: any[] = [];
  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  turnoPendienteCancelar: any = null;
  mostrarModalConfirmacion = false;

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.turnoService.obtenerHistorialTurnos().subscribe({
      next: ({ turnosPasados, turnosFuturos }) => {
        this.organizarTurnosPorDia(turnosPasados, 'pasados');
        this.organizarTurnosPorDia(turnosFuturos, 'futuros');
      },
      error: (err) => console.error('Error al obtener historial:', err)
    });
  }

  //Para nombrar FECHAS
  obtenerNombreDia(fechaISO: string | undefined): string {
  if (!fechaISO) return '';
  const fecha = parseISO(fechaISO);
  const indiceDia = getDay(fecha); // 0 = Domingo, 1 = Lunes, ...
  return this.diasSemana[indiceDia];
  }

  formatearFecha(fechaISO: string | undefined): string {
  if (!fechaISO) return '';
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anio}`;
  }

  formatearHora(horaStr: string | undefined): string {
  if (!horaStr) return '';
  // Si viene como '10:00:00', devolvemos solo '10:00'
  return horaStr.slice(0, 5);
  }

  organizarTurnosPorDia(turnos: any[], tipo: 'pasados' | 'futuros') {
    const turnosPorDia: { [fecha: string]: any[] } = {};
    const diasOrdenados: any[] = [];

    for (const turno of turnos) {
      const fechaStr = turno.fecha;
      const fechaObj = parseISO(fechaStr);

      if (!turnosPorDia[fechaStr]) {
        const [anio, mes, dia] = fechaStr.split('-');
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        turnosPorDia[fechaStr] = [];
        diasOrdenados.push({
          nombre: this.diasSemana[getDay(fechaObj)],
          fecha: fechaStr,
          fechaFormateada,
          expandido: false
        });
      }

      turnosPorDia[fechaStr].push(turno);
    }

    diasOrdenados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    if (tipo === 'pasados') {
      this.turnosPorDiaPasados = turnosPorDia;
      this.diasPasados = diasOrdenados;
    } else {
      this.turnosPorDiaFuturos = turnosPorDia;
      this.diasFuturos = diasOrdenados;
    }
  }

  // Abre modal personalizado para confirmar
  cancelarTurno(turno: any) {
    this.turnoPendienteCancelar = turno;
    this.mostrarModalConfirmacion = true;
  }

  confirmarCancelacion() {
    if (!this.turnoPendienteCancelar) return;

    this.turnoService.cancelarTurno(this.turnoPendienteCancelar.id).subscribe({
      next: () => {
        this.mostrarMensajeExito('Turno cancelado con éxito');
        this.mostrarModalConfirmacion = false;
        this.turnoPendienteCancelar = null;
        this.ngOnInit(); 
      },
      error: () => {
        this.mostrarMensajeError('No se pudo cancelar el turno');
        this.mostrarModalConfirmacion = false;
        this.turnoPendienteCancelar = null;
      }
    });
  }

  cancelarModal() {
    this.mostrarModalConfirmacion = false;
    this.turnoPendienteCancelar = null;
  }

  // Mensajes toast personalizados
  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    setTimeout(() => this.mensajeExito = null, 4000);
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => this.mensajeError = null, 4000);
  }
}

