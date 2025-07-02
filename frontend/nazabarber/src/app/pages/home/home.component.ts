import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../services/turno.service';
import { parseISO, getDay } from 'date-fns';
import { TurnoListaComponent } from '../../components/turno/turno-lista/turno-lista.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TurnoListaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TurnoService]
})
export class HomeComponent implements OnInit {
  turnos: any[] = [];
  turnosPorDia: { [fecha: string]: any[] } = {};
  diasOrdenados: { nombre: string; fecha: string; fechaFormateada: string; expandido: boolean }[] = [];

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  cortes = [
    { img: 'assets/corte1.jpg' },
    { img: 'assets/corte2.jpg' },
    { img: 'assets/corte3.jpg' },
    { img: 'assets/corte4.jpg' },
    { img: 'assets/corte5.jpg' },
    { img: 'assets/corte6.jpg' }
  ];

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.turnoService.obtenerTurnosDisponibles().subscribe({
      next: (res) => {
        this.turnos = res;
        this.organizarTurnosDesdeHoy();
      },
      error: (err) => console.error('Error al cargar turnos', err)
    });
  }

  organizarTurnosDesdeHoy() {
    this.turnosPorDia = {};
    this.diasOrdenados = [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const turnosFiltrados = this.turnos.filter(turno => {
      const fecha = parseISO(turno.fecha);
      return fecha >= hoy && getDay(fecha) !== 0; // Excluir domingos
    });

    for (let turno of turnosFiltrados) {
      const fechaStr = turno.fecha;
      const fecha = parseISO(fechaStr);

      if (!this.turnosPorDia[fechaStr]) {
        // Formato argentino dd/mm/yyyy
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

    // Ordenar días cronológicamente
    this.diasOrdenados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  solicitarTurno(turno: any) {
  const nombre = prompt('Tu nombre:');
  const email = prompt('Tu email:');
  const telefono = prompt('Tu teléfono:');

  if (!nombre || !email || !telefono) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  const datos = {
    fecha: turno.fecha,
    hora: turno.hora,
    nombre,
    email,
    telefono
  };

  this.turnoService.reservarTurnoAnonimo(datos).subscribe({
    next: () => {
      alert('Turno reservado con éxito');
      this.turnoService.obtenerTurnosDisponibles().subscribe({
        next: (res) => {
          this.turnos = res;
          this.organizarTurnosDesdeHoy();
        },
        error: (err) => console.error('Error al recargar turnos', err)
      });
    },
    error: (err) => {
      console.error(err);
      alert('Error al reservar turno');
    }
  });
  }
}
