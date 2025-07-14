import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      repetirContrasena: ['', Validators.required]
    });
  }

  registrar() {
    if (this.form.invalid) return;

    const { nombre, email, telefono, contraseña, repetirContrasena } = this.form.value;

    if (contraseña !== repetirContrasena) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.auth.registrar({ nombre, email, telefono, contraseña }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error = 'Error al crear la cuenta'
    });
  }
}
