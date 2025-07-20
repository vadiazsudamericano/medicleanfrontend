import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleHerramientaComponent } from './detalle-herramienta';

describe('DetalleHerramienta', () => {
  let component: DetalleHerramientaComponent;
  let fixture: ComponentFixture<DetalleHerramientaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleHerramientaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleHerramientaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
