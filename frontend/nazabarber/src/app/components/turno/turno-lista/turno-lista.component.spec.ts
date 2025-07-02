import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoListaComponent } from './turno-lista.component';

describe('TurnoListaComponent', () => {
  let component: TurnoListaComponent;
  let fixture: ComponentFixture<TurnoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
