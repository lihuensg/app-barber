import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedSocialService } from '../../../services/red-social.service';
import { AuthService } from '../../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss',
  animations: [
    trigger('likeAnim', [
      transition(':increment', [
        style({ transform: 'scale(1.2)', color: 'red' }),
        animate('200ms ease-out', style({ transform: 'scale(1)', color: 'inherit' }))
      ]),
      transition(':decrement', [
        style({ transform: 'scale(0.8)', color: '#555' }),
        animate('200ms ease-out', style({ transform: 'scale(1)', color: 'inherit' }))
      ])
    ])
  ]
})
export class PostItemComponent implements OnInit {
  @Input() post: any;

  mostrarComentarios = false;
  nuevoComentario = '';
  yaLikeado = false;
  likeCount = 0;

  // Variables para modal eliminar post
  mostrarModalEliminarPost: boolean = false;

  constructor(
    private redSocialService: RedSocialService,
    private authService: AuthService
  ) {}

  get usuarioLogueado() {
    return this.authService.getUsuario();
  }

  ngOnInit(): void {
    this.yaLikeado = this.post.Likes?.some((like: any) => like.usuario_id === this.usuarioLogueado?.id);
    this.likeCount = this.post.Likes?.length || 0;
  }

  toggleComentarios() {
    this.mostrarComentarios = !this.mostrarComentarios;
  }

  toggleLike() {
    if (!this.yaLikeado) {
      this.redSocialService.darLike(this.post.id).subscribe(() => {
        this.post.Likes.push({ usuario_id: this.usuarioLogueado.id });
        this.yaLikeado = true;
        this.likeCount++;
      });
    } else {
      this.redSocialService.quitarLike(this.post.id).subscribe(() => {
        this.post.Likes = this.post.Likes.filter((like: any) => like.usuario_id !== this.usuarioLogueado.id);
        this.yaLikeado = false;
        this.likeCount--;
      });
    }
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim()) return;

    this.redSocialService.comentar(this.post.id, this.nuevoComentario).subscribe((comentario: any) => {
      comentario.Usuario = this.usuarioLogueado;
      this.post.Comentarios.push(comentario);
      this.nuevoComentario = '';
    });
  }

  eliminarComentario(comentarioId: string) {
    this.redSocialService.eliminarComentario(comentarioId).subscribe(() => {
      this.post.Comentarios = this.post.Comentarios.filter((c: any) => c.id !== comentarioId);
    });
  }

  abrirModalEliminarPost() {
    this.mostrarModalEliminarPost = true;
  }

  cancelarEliminarPost() {
    this.mostrarModalEliminarPost = false;
  }

  confirmarEliminarPost() {
    this.redSocialService.eliminarPost(this.post.id).subscribe(() => {
      this.post.eliminado = true;
      this.mostrarModalEliminarPost = false;
    });
  }

  puedeEliminarPost(): boolean {
    return this.usuarioLogueado?.id === this.post.Usuario?.id || this.usuarioLogueado?.rol === 'admin';
  }

  puedeEliminarComentario(comentario: any): boolean {
    return this.usuarioLogueado?.id === comentario.Usuario?.id || this.usuarioLogueado?.rol === 'admin';
  }
}
