import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedSocialService {

  private apiUrl = 'http://localhost:4000/api/redsocial';
  private headers() {
    return { Authorization: `Bearer ${this.auth.getToken()}` };
  }
  constructor(private http: HttpClient, private auth: AuthService) { }

  crearPost(formData: FormData) {
    return this.http.post(`${this.apiUrl}/post`, formData, { headers: this.headers() });
  }

  obtenerPosts() {
    return this.http.get(`${this.apiUrl}/posts`, { headers: this.headers() });
  }

  darLike(postId: string) {
    return this.http.post(`${this.apiUrl}/likes/${postId}`, {}, { headers: this.headers() });
  }

  comentar(postId: string, contenido: string) {
    return this.http.post(`${this.apiUrl}/comentarios/${postId}`, { contenido }, { headers: this.headers() });
  }
}
