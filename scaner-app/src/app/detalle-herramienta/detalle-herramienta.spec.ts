import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleHerramienta } from './detalle-herramienta';

describe('DetalleHerramienta', () => {
  let component: DetalleHerramienta;
  let fixture: ComponentFixture<DetalleHerramienta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleHerramienta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleHerramienta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
