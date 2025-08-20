import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { TurnoListaComponent } from '../../components/turno/turno-lista/turno-lista.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TurnoListaComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TurnoService]
})
export class HomeComponent implements OnInit {
  turnos: any[] = [];
  adminPerfil: any = null;
  formularioAnonimo!: FormGroup;
  mostrarFormulario: boolean = false;
  turnoSeleccionado: any = null;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;
  mostrarAdvertencia: boolean = false;

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
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarTurnos();
    this.cargarAdminPerfil();
    this.inicializarFormulario();

    // Mostrar advertencia solo una vez
    const yaMostrado = localStorage.getItem('advertenciaMostrada');
    if (!yaMostrado) {
      this.mostrarAdvertencia = true;
    }
  }

  cerrarAdvertencia(): void {
    this.mostrarAdvertencia = false;
    sessionStorage.setItem('advertenciaMostrada', 'true');
  }


  inicializarFormulario() {
    this.formularioAnonimo = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.email]],
      telefono: ['']
    });
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
    
    if (esLogueado && !esAdmin) {
      const datos = { fecha: turno.fecha, hora: turno.hora };

      this.turnoService.reservarTurnoCliente(datos).subscribe({
        next: () => {
          this.mensajeExito = 'Turno reservado con éxito.';
          this.cargarTurnos();
          setTimeout(() => this.mensajeExito = null, 3000);
        },
        error: (err) => {
          this.mensajeError = 'Error al reservar turno como cliente.';
          console.error(err);
        setTimeout(() => this.mensajeError = null, 3000);
        }
      });
      return;
    }

    // Mostrar formulario para no logueados o admin logueado
    this.turnoSeleccionado = turno;
    this.mostrarFormulario = true;
  }

  confirmarTurnoAnonimo() {
    if (!this.formularioAnonimo.valid) {
      this.mensajeError = 'Por favor, completá los campos obligatorios correctamente.';
      return;
    }

    const email = this.formularioAnonimo.get('email')?.value;
    const telefono = this.formularioAnonimo.get('telefono')?.value;

    const datos = {
      fecha: this.turnoSeleccionado.fecha,
      hora: this.turnoSeleccionado.hora,
      nombre: this.formularioAnonimo.get('nombre')?.value,
      email: email || '',
      telefono: telefono || ''
    };

    this.turnoService.reservarTurnoAnonimo(datos).subscribe({
      next: () => {
        this.mensajeExito = 'Turno reservado con éxito.';
        this.mensajeError = null;
        this.formularioAnonimo.reset();
        this.cargarTurnos();
        // Ocultar mensaje después de 3s
        setTimeout(() => {
          this.mostrarFormulario = false;
          this.mensajeExito = null;
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = err.status === 429
        ? (err.error?.mensaje)
        :'Has alcanzado el límite máximo de reservas permitidas. Por favor, intenta nuevamente más tarde.';
        this.mensajeExito = null;
        // Ocultar mensaje de error después de 3s
        setTimeout(() => this.mensajeError = null, 3000);
      }
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.formularioAnonimo.reset();
  }
}
