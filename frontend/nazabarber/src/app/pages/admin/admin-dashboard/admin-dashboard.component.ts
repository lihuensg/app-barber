import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TurnoService } from '../../../services/turno.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  constructor(private turnoService: TurnoService) {}

  generarTurnos() {
    this.turnoService.generarSemana().subscribe(() => {
      alert('Turnos generados correctamente');
    });
  }
}
