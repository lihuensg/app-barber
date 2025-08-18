import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuAbierto = false;
  mostrarModalLogout = false;

  constructor(private authService: AuthService, private router: Router) {}

  get estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }

  get esAdmin(): boolean {
    return this.authService.esAdmin();
  }

  get nombreUsuario(): string {
    return this.authService.getUsuario()?.nombre ?? '';
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  irAInicio() {
    this.router.navigate(['/']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  abrirModalLogout() {
    this.mostrarModalLogout = true;
  }

  cancelarLogout() {
    this.mostrarModalLogout = false;
  }

  confirmarLogout() {
    this.authService.logout();
    this.mostrarModalLogout = false;
    this.router.navigate(['/']);
  }
  
  cerrarMenu() {
    this.menuAbierto = false;
  }
}
