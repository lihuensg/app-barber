import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedSocialService } from '../../../services/red-social.service';

@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-post.component.html',
  styleUrl: './crear-post.component.scss'
})
export class CrearPostComponent {
  contenido: string = '';
  imagen: File | null = null;
  mensaje: string = '';

  constructor(private redSocialService: RedSocialService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagen = input.files[0];
    }
  }

  publicarPost() {
    if (!this.contenido || !this.imagen) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    const formData = new FormData();
    formData.append('contenido', this.contenido);
    formData.append('imagen', this.imagen);

    this.redSocialService.crearPost(formData).subscribe({
      next: () => {
        this.mensaje = 'Post publicado con éxito.';
        this.contenido = '';
        this.imagen = null;
        (document.getElementById('imagen') as HTMLInputElement).value = '';
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al publicar el post.';
      }
    });
  }
}
