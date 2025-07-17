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

  constructor(private usuarioService: UsuarioService, private turnoService: TurnoService) {}

  ngOnInit(): void {
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

  cancelarTurno(turno: any) {
    if (confirm(`¿Estás seguro que querés cancelar el turno de ${turno.hora} del ${turno.fecha}?`)) {
      this.turnoService.cancelarTurnoCliente(turno.id).subscribe({
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
