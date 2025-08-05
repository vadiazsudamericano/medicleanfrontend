import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoDesinfeccion } from './proceso-desinfeccion';

describe('ProcesoDesinfeccion', () => {
  let component: ProcesoDesinfeccion;
  let fixture: ComponentFixture<ProcesoDesinfeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoDesinfeccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoDesinfeccion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
