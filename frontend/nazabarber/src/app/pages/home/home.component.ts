import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../services/turno.service';
import { TurnoListaComponent } from '../../components/turno/turno-lista/turno-lista.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TurnoListaComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TurnoService]
})
export class HomeComponent implements OnInit {
  turnos: any[] = [];

  cortes = [
    { img: 'assets/corte1.jpg' },
    { img: 'assets/corte2.jpg' },
    { img: 'assets/corte3.jpg' },
    { img: 'assets/corte4.jpg' },
    { img: 'assets/corte5.jpg' },
    { img: 'assets/corte6.jpg' }
  ];

  constructor(
    private turnoService: TurnoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.turnoService.obtenerTurnosDisponibles().subscribe({
      next: (res) => {
        this.turnos = res;
      },
      error: (err) => console.error('Error al cargar turnos', err)
    });
  }

  solicitarTurno(turno: any) {
    if (this.auth.estaLogueado() && !this.auth.esAdmin()) {
      // Usuario logueado pero cliente → usar el endpoint con cliente_id
      const datos = { fecha: turno.fecha, hora: turno.hora };

      this.turnoService.reservarTurnoCliente(datos).subscribe({
        next: () => {
          alert('Turno reservado con éxito como usuario registrado');
          this.cargarTurnos();
        },
        error: (err) => {
          console.error(err);
          alert('Error al reservar turno como cliente');
        }
      });
    } else {
      // Usuario no logueado o admin → pedir datos manualmente
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
          this.cargarTurnos();
        },
        error: (err) => {
          console.error(err);
          alert('Error al reservar turno');
        }
      });
    }
  }
}
