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

  cancelarTurno(turno: any) {
    if (confirm(`¿Estás seguro que querés cancelar el turno de ${turno.hora} del ${turno.fecha}?`)) {
      this.turnoService.eliminarTurno(turno.id).subscribe({
        next: () => {
          // Refrescar los datos después de cancelar
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error al cancelar turno:', err);
        }
      });
    }
  }
}
