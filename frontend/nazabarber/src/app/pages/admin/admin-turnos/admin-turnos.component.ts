import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnoService } from '../../../services/turno.service';
import { TurnoListaComponent } from '../../../components/turno/turno-lista/turno-lista.component';
import { parseISO, getDay } from 'date-fns';

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
  modoEditar: boolean = false;
  turnoEditar: any = null;

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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
  }

  cargarTurnos() {
    this.turnoService.obtenerTurnosDisponibles().subscribe({
      next: (res) => {
        this.turnos = res;
      },
      error: (err) => console.error('Error al cargar turnos', err)
    });
  }

  crearTurno() {
    if (this.formularioTurno.invalid) return;

    const nuevoTurno = this.formularioTurno.value;

    this.turnoService.crearTurno(nuevoTurno).subscribe({
      next: () => {
        alert('Turno creado con éxito');
        this.formularioTurno.reset();
        this.cargarTurnos();
      },
      error: (err) => alert('Error al crear turno: ' + err.error?.msg || err.message)
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
        alert('Turno actualizado con éxito');
        this.cancelarEdicion();
        this.cargarTurnos();
      },
      error: (err) => alert('Error al actualizar turno: ' + err.error?.msg || err.message)
    });
  }

  eliminarTurno(id: string) {
    if (!confirm('¿Estás seguro que quieres eliminar este turno?')) return;

    this.turnoService.eliminarTurno(id).subscribe({
      next: () => {
        alert('Turno eliminado con éxito');
        this.cargarTurnos();
      },
      error: (err) => alert('Error al eliminar turno: ' + err.error?.msg || err.message)
    });
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

  // Métodos para manejar eventos del hijo TurnoListaComponent
  onEditarTurno(turno: any) {
    this.prepararEdicion(turno);
  }

  onEliminarTurno(turno: any) {
    this.eliminarTurno(turno.id);
  }
}
