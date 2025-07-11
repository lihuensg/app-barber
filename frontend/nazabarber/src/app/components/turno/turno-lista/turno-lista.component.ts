import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { parseISO, getDay } from 'date-fns';

@Component({
  selector: 'app-turno-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turno-lista.component.html',
  styleUrls: ['./turno-lista.component.scss']
})
export class TurnoListaComponent implements OnChanges {
  @Input() turnos: any[] = [];
  @Input() claseEstilo: string = 'modo-oscuro';
  @Input() editable: boolean = false;
  @Output() reservar = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  turnosPorDia: { [fecha: string]: any[] } = {};
  diasOrdenados: { nombre: string; fecha: string; fechaFormateada: string; expandido: boolean }[] = [];

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['turnos']) {
      this.organizarTurnosDesdeHoy();
    }
  }

  organizarTurnosDesdeHoy() {
  this.turnosPorDia = {};
  this.diasOrdenados = [];

  const ahora = new Date();
  ahora.setSeconds(0, 0); // Para comparar horas sin milisegundos

  const turnosFiltrados = this.turnos.filter(turno => {
    const fecha = parseISO(turno.fecha);

    // Excluir domingos
    if (getDay(fecha) === 0) return false;

    // Si es hoy, filtrar por hora
    if (
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getDate() === ahora.getDate()
    ) {
      const [h, m] = turno.hora.split(':').map(Number);
      const horaTurno = new Date();
      horaTurno.setHours(h, m, 0, 0);

      return horaTurno >= ahora;
    }

    // Si es en el futuro, mostrarlo
    return fecha > ahora;
  });

  for (let turno of turnosFiltrados) {
    const fechaStr = turno.fecha;
    const fecha = parseISO(fechaStr);

    if (!this.turnosPorDia[fechaStr]) {
      const [anio, mes, dia] = fechaStr.split('-');
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      this.turnosPorDia[fechaStr] = [];
      this.diasOrdenados.push({
        nombre: this.diasSemana[getDay(fecha)],
        fecha: fechaStr,
        fechaFormateada,
        expandido: false
      });
    }

    this.turnosPorDia[fechaStr].push(turno);
  }

  this.diasOrdenados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  } 
}
