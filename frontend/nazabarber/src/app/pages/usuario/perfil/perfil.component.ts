import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { UsuarioService }    from '../../../services/usuario.service';

@Component({
  selector   : 'app-perfil',
  standalone : true,
  imports    : [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls  : ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  /** Datos del usuario */
  perfil: any = null;

  /** Flags de edición por campo */
  editando: Record<'nombre' | 'email' | 'telefono', boolean> = {
    nombre  : false,
    email   : false,
    telefono: false
  };

  /** Mensajes de error por campo */
  errores: Record<'nombre' | 'email' | 'telefono', string> = {
    nombre  : '',
    email   : '',
    telefono: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next : (res) => (this.perfil = res),
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }

  /** Cambia entre modo edición / visualización y guarda si procede */
  toggleEdit(campo: 'nombre' | 'email' | 'telefono'): void {
    if (this.editando[campo]) {
      /* ─── Estaba editando → validar antes de guardar ─── */
      const valor = this.perfil[campo]?.toString().trim();

      // 1) No vacío
      if (!valor) {
        this.errores[campo] = 'Este campo no puede estar vacío';
        return;
      }

      // 2) Formato email
      if (campo === 'email' && !this.validarEmail(valor)) {
        this.errores[campo] = 'El email no es válido';
        return;
      }

      // ✔️ Sin errores → limpiar mensaje y enviar al backend
      this.errores[campo] = '';

      const datos = { [campo]: valor };
      this.usuarioService.actualizarPerfil(datos).subscribe({
        next : () => (this.editando[campo] = false),
        error: ()  => alert('Error al actualizar')
      });
    } else {
      /* ─── Entrar en modo edición ─── */
      this.errores[campo] = '';
      this.editando[campo] = true;
    }
  }

  /** Expresión regular básica para validar e‑mail */
  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
