import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../services/turno.service';
import { TurnoListaComponent } from '../../components/turno/turno-lista/turno-lista.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

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
  adminPerfil: any = null;
  
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
    private auth: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarTurnos();
    this.cargarAdminPerfil();
  }

  cargarTurnos() {
    this.turnoService.obtenerTurnosDisponibles().subscribe({
      next: (res) => {
        this.turnos = res;
      },
      error: (err) => console.error('Error al cargar turnos', err)
    });
  }

  cargarAdminPerfil() {
  this.usuarioService.obtenerDatosAdminPublicos().subscribe({
    next: (res) => {
      this.adminPerfil = res;
    },
    error: (err) => console.error('Error al cargar perfil admin público', err)
  });
  }

  solicitarTurno(turno: any) {
  const esLogueado = this.auth.estaLogueado();
  const esAdmin = this.auth.esAdmin();

  // Caso 1: Usuario cliente logueado
  if (esLogueado && !esAdmin) {
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
    return;
  }

  // Caso 2 y 3: Usuario no logueado o admin logueado
  const nombre = prompt('Tu nombre:');
  if (!nombre) {
    alert('El nombre es obligatorio.');
    return;
  }

  const email = prompt('Tu email (opcional):');
  const telefono = prompt('Tu teléfono (opcional):');

  // 👉 Ya NO validamos email/telefono como obligatorios para no logueados ni admin
  const datos = {
    fecha: turno.fecha,
    hora: turno.hora,
    nombre,
    email: email || '',
    telefono: telefono || ''
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
