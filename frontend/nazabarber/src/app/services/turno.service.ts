import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private API = 'http://localhost:4000/api/turnos'; // ajustá la URL según tu backend

  constructor(private http: HttpClient) {}

  obtenerTurnosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/disponibles`);
  }

  reservarTurnoAnonimo(data: any): Observable<any> {
    return this.http.post(`${this.API}/anonimo`, data);
  }
}
