import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { TurnoService } from '../../../services/turno.service';
import { parseISO, getDay } from 'date-fns';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MisTurnosComponent implements OnInit {
  turnosPorDiaPasados: { [fecha: string]: any[] } = {};
  turnosPorDiaFuturos: { [fecha: string]: any[] } = {};
  diasPasados: any[] = [];
  diasFuturos: any[] = [];
  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  turnoACancelar: any = null;
  mostrarModalCancelar = false;

  constructor(private usuarioService: UsuarioService, private turnoService: TurnoService) {
  }

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.usuarioService.obtenerMisTurnos().subscribe({
      next: ({ futuros, pasados }) => {
        this.organizarTurnosPorDia(futuros, 'futuros');
        this.organizarTurnosPorDia(pasados, 'pasados');
      },
      error: err => console.error('Error al obtener mis turnos:', err)
    });
  }

  organizarTurnosPorDia(turnos: any[], tipo: 'futuros' | 'pasados') {
    const agrupados: { [fecha: string]: any[] } = {};
    const dias: any[] = [];

    for (const turno of turnos) {
      const fecha = turno.fecha;
      const fechaObj = parseISO(fecha);

      if (!agrupados[fecha]) {
        const [a, m, d] = fecha.split('-');
        agrupados[fecha] = [];
        dias.push({
          nombre: this.diasSemana[getDay(fechaObj)],
          fecha,
          fechaFormateada: `${d}/${m}/${a}`,
          expandido: false
        });
      }

      agrupados[fecha].push(turno);
    }

    dias.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    if (tipo === 'futuros') {
      this.turnosPorDiaFuturos = agrupados;
      this.diasFuturos = dias;
    } else {
      this.turnosPorDiaPasados = agrupados;
      this.diasPasados = dias;
    }
  }

  solicitarCancelarTurno(turno: any) {
    this.turnoACancelar = turno;
    this.mostrarModalCancelar = true;
  }

  confirmarCancelacion() {
    if (!this.turnoACancelar) return;

    this.turnoService.cancelarTurnoCliente(this.turnoACancelar.id).subscribe({
      next: () => {
        this.mostrarMensajeExito('Turno cancelado con éxito');
        this.cargarTurnos();
      },
      error: () => {
        this.mostrarMensajeError('Error al cancelar el turno');
      },
      complete: () => {
        this.turnoACancelar = null;
        this.mostrarModalCancelar = false;
      }
    });
  }

  cancelarModal() {
    this.turnoACancelar = null;
    this.mostrarModalCancelar = false;
  }

  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    setTimeout(() => (this.mensajeExito = null), 4000);
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => (this.mensajeError = null), 4000);
  }
}