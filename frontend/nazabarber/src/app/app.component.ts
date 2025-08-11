import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InactividadService } from './services/inactividad.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, OnDestroy {

  private subAuthState!: Subscription;

  constructor(
    private inactividadService: InactividadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subAuthState = this.authService.authState$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.inactividadService.iniciarDeteccion();
      } else {
        this.inactividadService.detenerDeteccion();
      }
    });
  }

  ngOnDestroy(): void {
    this.subAuthState.unsubscribe();
    this.inactividadService.detenerDeteccion();
  }
}
