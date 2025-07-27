import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedSocialService } from '../../../services/red-social.service';
import { PostItemComponent } from "../post-item/post-item.component";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [CommonModule, PostItemComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit {
  posts: any[] = [];
  cantidadMostrada = 3;
  cargando = false;

  constructor (private redSocialService: RedSocialService) { }
  
  ngOnInit(): void {
    this.cargarPosts();
  }

  cargarPosts() {
    this.cargando = true;
    this.redSocialService.obtenerPosts().subscribe({
      next: (data) => {
        this.posts = data as any[];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener los posts:', error);
        this.cargando = false;
      }
    });
  }

  mostrarMas() {
    this.cantidadMostrada += 3;
  }
}
