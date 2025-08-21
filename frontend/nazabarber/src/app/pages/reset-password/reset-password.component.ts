import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  nuevaContrasena = '';
  mensaje = '';
  token = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  resetear() {
    this.authService.resetPassword(this.token, this.nuevaContrasena).subscribe({
      next: (res) => this.mensaje = res.mensaje,
      error: (err) => this.mensaje = err.error.mensaje
    });
  }
}
