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
  descripcion: string = '';
  imagen: File | null = null;
  imagenURL: string | null = null;
  mensaje: string = '';

  constructor(private redSocialService: RedSocialService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagen = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenURL = e.target.result;
      };
      reader.readAsDataURL(this.imagen);
    }
  }

  eliminarImagen() {
    this.imagen = null;
    this.imagenURL = null;
    (document.getElementById('imagen') as HTMLInputElement).value = '';
  }

  publicarPost() {
    if (!this.descripcion || !this.imagen) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', this.descripcion);
    formData.append('imagen', this.imagen);

    this.redSocialService.crearPost(formData).subscribe({
      next: () => {
        this.mensaje = 'Post publicado con éxito.';
        this.descripcion = '';
        this.imagen = null;
        this.imagenURL = null;
        (document.getElementById('imagen') as HTMLInputElement).value = '';
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al publicar el post.';
      }
    });
  }
}
