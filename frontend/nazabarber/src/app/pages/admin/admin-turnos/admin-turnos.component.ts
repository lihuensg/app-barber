import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnoService } from '../../../services/turno.service';
import { TurnoListaComponent } from '../../../components/turno/turno-lista/turno-lista.component';

@Component({
  selector: 'app-admin-turnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TurnoListaComponent],
  templateUrl: './admin-turnos.component.html',
  styleUrls: ['./admin-turnos.component.scss']
})
export class AdminTurnosComponent implements OnInit {
  turnos: any[] = [];
  formularioTurno: FormGroup;
  formularioEdicion: FormGroup;
  formularioAnonimo!: FormGroup;
  modoEditar = false;
  turnoEditar: any = null;
  mostrarFormulario = false;
  turnoSeleccionado: any = null;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  turnoAEliminar: any = null;
  mostrarModalConfirmacion = false;

  constructor(private turnoService: TurnoService, private fb: FormBuilder) {
    this.formularioTurno = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });

    this.formularioEdicion = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarTurnos();
    this.inicializarFormulario();
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
      next: (res) => this.turnos = res,
      error: (err) => console.error('Error al cargar turnos', err)
    });
  }

  crearTurno() {
    if (this.formularioTurno.invalid) return;

    const nuevoTurno = this.formularioTurno.value;

    this.turnoService.crearTurno(nuevoTurno).subscribe({
      next: () => {
        this.mostrarMensajeExito('Turno creado con éxito');
        this.formularioTurno.reset();
        this.cargarTurnos();
      },
      error: (err) => {
        this.mostrarMensajeError('Error al crear turno');
      }
    });
  }

  prepararEdicion(turno: any) {
    this.modoEditar = true;
    this.turnoEditar = turno;
    this.formularioEdicion.setValue({
      fecha: turno.fecha,
      hora: turno.hora
    });
  }

  cancelarEdicion() {
    this.modoEditar = false;
    this.turnoEditar = null;
    this.formularioEdicion.reset();
  }

  editarTurno() {
    if (this.formularioEdicion.invalid) return;

    const datosEditados = this.formularioEdicion.value;

    this.turnoService.actualizarTurno(this.turnoEditar.id, datosEditados).subscribe({
      next: () => {
        this.mostrarMensajeExito('Turno actualizado con éxito');
        this.cancelarEdicion();
        this.cargarTurnos();
      },
      error: (err) => {
        this.mostrarMensajeError('Error al actualizar turno');
      }
    });
  }

  confirmarEliminacion() {
    if (!this.turnoAEliminar) return;

    this.turnoService.eliminarTurno(this.turnoAEliminar.id).subscribe({
      next: () => {
        this.mostrarMensajeExito('Turno eliminado con éxito');
        this.cargarTurnos();
      },
      error: () => {
        this.mostrarMensajeError('Error al eliminar el turno');
      },
      complete: () => {
        this.turnoAEliminar = null;
        this.mostrarModalConfirmacion = false;
      }
    });
  }

  cancelarEliminacion() {
    this.turnoAEliminar = null;
    this.mostrarModalConfirmacion = false;
  }
  
  solicitarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.mostrarFormulario = true;
    this.formularioAnonimo.reset();
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.turnoSeleccionado = null;
    this.formularioAnonimo.reset();
  }

  confirmarTurnoAnonimo() {
    if (this.formularioAnonimo.invalid || !this.turnoSeleccionado) {
      this.mostrarMensajeError('Por favor, completá los campos obligatorios correctamente.');
      return;
    }

    const datos = {
      fecha: this.turnoSeleccionado.fecha,
      hora: this.turnoSeleccionado.hora,
      nombre: this.formularioAnonimo.get('nombre')?.value,
      email: this.formularioAnonimo.get('email')?.value || '',
      telefono: this.formularioAnonimo.get('telefono')?.value || ''
    };

    this.turnoService.reservarTurnoAnonimo(datos).subscribe({
      next: () => {
        this.mostrarMensajeExito('Turno reservado con éxito');
        this.formularioAnonimo.reset();
        this.mostrarFormulario = false;
        this.turnoSeleccionado = null;
        this.cargarTurnos();
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensajeError(
          err.status === 429
            ? (err.error?.mensaje || 'Demasiadas reservas')
            : 'Error al reservar turno, intenta nuevamente'
        );
      }
    });
  }

  // Eventos del hijo
  onEditarTurno(turno: any) {
    this.prepararEdicion(turno);
  }

   onEliminarTurno(turno: any) {
    this.turnoAEliminar = turno;
    this.mostrarModalConfirmacion = true;
  }

  // Métodos para mostrar mensajes temporales
  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    setTimeout(() => this.mensajeExito = null, 4000);
  }

  mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => this.mensajeError = null, 4000);
  }
}
