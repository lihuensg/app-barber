import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API = 'http://localhost:4000/api/usuario'; 
  private headers() {
    return { Authorization: `Bearer ${this.auth.getToken()}` };
  }
  constructor(private http: HttpClient, private auth: AuthService) {}

  obtenerPerfil(): Observable<any> {
    return this.http.get(`${this.API}`, { headers: this.headers() });
  }

  actualizarPerfil(datos: any): Observable<any> {
    return this.http.put(`${this.API}`, datos, { headers: this.headers() });
  }

  obtenerMisTurnos(): Observable<{ futuros: any[]; pasados: any[] }> {
      return this.http.get<{ futuros: any[]; pasados: any[] }>(
        `${this.API}/mis-turnos`,
        { headers: this.headers() }
      );
  }
}
