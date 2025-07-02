import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/api/auth';

constructor(private http: HttpClient, private router: Router) {}

  login(email: string, contraseña: string) {
    return this.http.post(`${this.baseUrl}/login`, { email, contraseña });
  }

  guardarToken(token: string, usuario: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  esAdmin() {
    return this.getUsuario()?.rol === 'admin';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  estaLogueado() {
    return !!this.getToken();
  }
}