// src/app/services/inactividad.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class InactividadService {
  private readonly LIMITE_INACTIVIDAD = 2 * 60 * 60 * 1000; // 2 horas
  private timerId: any;

  // Guardamos las referencias para poder remover los listeners si es necesario
  private eventos = [
    'mousemove',
    'keydown',
    'click',
    'scroll',
    'touchstart'
  ];
  private handlers: { [key: string]: () => void } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  iniciarDeteccion() {
    if(!this.authService.estaLogueado()) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.eventos.forEach(evento => {
        this.handlers[evento] = () => this.resetearTimer();
        window.addEventListener(evento, this.handlers[evento]);
      });
    });

    this.resetearTimer();
  }

  detenerDeteccion() {
    this.eventos.forEach(evento => {
      if (this.handlers[evento]) {
        window.removeEventListener(evento, this.handlers[evento]);
      }
    });
    clearTimeout(this.timerId);
  }

  private resetearTimer() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => this.expirarSesion(), this.LIMITE_INACTIVIDAD);
  }

  private expirarSesion() {
    this.ngZone.run(() => {
      import('sweetalert2').then(Swal => {
        Swal.default.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Por inactividad, tu sesión ha finalizado.',
          confirmButtonText: 'Iniciar sesión nuevamente',
          confirmButtonColor: '#3085d6',
          background: '#1e1e1e',
          color: '#fff'
        }).then(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        });
      });
    });
  }
}
