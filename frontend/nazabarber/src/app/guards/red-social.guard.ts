// red-social.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedSocialGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.auth.getUsuario();

    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    if (usuario.rol === 'cliente' || usuario.rol === 'admin') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
