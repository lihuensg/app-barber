import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  mensaje = '';

  constructor(private authService: AuthService) {}

  enviarEmail() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => this.mensaje = res.mensaje,
      error: (err) => this.mensaje = err.error.mensaje
    });
  }
}
