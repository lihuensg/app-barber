import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfil: any = null;
  esAdmin: boolean = false;

  editando: Record<'nombre' | 'email' | 'telefono' | 'instagram', boolean> = {
    nombre: false,
    email: false,
    telefono: false,
    instagram: false,
  };

  errores: Record<'nombre' | 'email' | 'telefono' | 'instagram', string> = {
    nombre: '',
    email: '',
    telefono: '',
    instagram: '',
  };

  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

  ngOnInit(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (res) => {
        this.perfil = res;
        this.esAdmin = this.perfil.rol === 'admin';
      },
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }

  toggleEdit(campo: 'nombre' | 'email' | 'telefono' | 'instagram'): void {
    if (this.editando[campo]) {
      const valor = this.perfil[campo]?.toString().trim() || '';

      // Validación para campos obligatorios
      if (campo === 'nombre' && !valor) {
        this.errores[campo] = 'Este campo no puede estar vacío';
        return;
      }

      if (campo === 'email' && valor && !this.validarEmail(valor)) {
        this.errores[campo] = 'El email no es válido';
        return;
      }

      // Para telefono e instagram no es obligatorio

      this.errores[campo] = '';

      const datos = { [campo]: valor };
      this.usuarioService.actualizarPerfil(datos).subscribe({
        next: () => (this.editando[campo] = false),
        error: () => alert('Error al actualizar')
      });
    } else {
      this.errores[campo] = '';
      this.editando[campo] = true;
    }
  }

  subirFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const archivo = input.files[0];
    const formData = new FormData();
    formData.append('foto_perfil', archivo);

    this.usuarioService.actualizarPerfil(formData).subscribe({
      next: () => {
        this.usuarioService.obtenerPerfil().subscribe(res => this.perfil = res);
      },
      error: () => alert('Error al subir la foto')
    });
  }

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
