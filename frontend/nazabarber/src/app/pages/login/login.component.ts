import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, contrasena } = this.form.value;

    this.auth.login(email, contrasena).subscribe({
      next: (res: any) => {
        this.auth.guardarToken(res.token, res.usuario);

        if (this.auth.esAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/usuario']);
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }

  irACrearCuenta() {
    this.router.navigate(['/registro']);
  }
}
