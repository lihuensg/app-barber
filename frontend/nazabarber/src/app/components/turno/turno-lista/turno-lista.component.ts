import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-turno-lista',
  templateUrl: './turno-lista.component.html',
  styleUrls: ['./turno-lista.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TurnoListaComponent {
  @Input() diasOrdenados: any[] = [];
  @Input() turnosPorDia: { [key: string]: any[] } = {};
  @Output() reservar = new EventEmitter<any>();
}
