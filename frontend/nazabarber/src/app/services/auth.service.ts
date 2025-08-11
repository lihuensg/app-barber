import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:4000/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(false);
  authState$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar, revisamos si hay token en localStorage
    const token = localStorage.getItem('token');
    this.loggedIn.next(!!token);
  }

  login(email: string, contraseña: string) {
    return this.http.post(`${this.baseUrl}/login`, { email, contraseña });
  }

  guardarToken(token: string, usuario: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.loggedIn.next(true); //Emitimos que está logueado
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
    this.loggedIn.next(false); // Emitimos que cerró sesión
    this.router.navigate(['/']);
  }

  estaLogueado() {
    return this.loggedIn.value;
  }

  registrar(data: any) {
    return this.http.post(`${this.baseUrl}/registrar`, data);
  }
}
