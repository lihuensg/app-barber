import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private API = 'http://localhost:4000/api/turnos'; 
  private headers() {
    return { Authorization: `Bearer ${this.auth.getToken()}` };
  }
  constructor(private http: HttpClient, private auth: AuthService) {}

  obtenerTurnosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/disponibles`);
  }

  reservarTurnoAnonimo(data: any): Observable<any> {
    return this.http.post(`${this.API}/anonimo`, data);
  }

  reservarTurnoCliente(data: any) {
    return this.http.post(`${this.API}/cliente`, data, { headers: this.headers() });
  }

  crearTurno(data: any) {
    return this.http.post(`${this.API}/crear`, data, { headers: this.headers() });
  }

  generarSemana() {
    return this.http.post(`${this.API}/generar-semana`, {}, { headers: this.headers() });
  }

  actualizarTurno(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data, { headers: this.headers() });
  }

  eliminarTurno(id: string) {
    return this.http.delete(`${this.API}/${id}`, { headers: this.headers() });
  }

  obtenerUltimosReservados() {
    return this.http.get<any[]>(`${this.API}/ultimos`, { headers: this.headers() });
  }

  obtenerHistorialTurnos() {
  return this.http.get<{ turnosPasados: any[], turnosFuturos: any[] }>(
    `${this.API}/historial`,
    { headers: this.headers() }
    );
  }

  cancelarTurno(id: string) {
  return this.http.put(`${this.API}/cancelar/${id}`, {}, { headers: this.headers() });
  }

  cancelarTurnoCliente(id: string) {
    return this.http.put(`${this.API}/cancelarCliente/${id}`, {}, { headers: this.headers() });
  }
}
