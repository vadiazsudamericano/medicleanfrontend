import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Herramienta } from './herramienta';

describe('Herramienta', () => {
  let component: Herramienta;
  let fixture: ComponentFixture<Herramienta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Herramienta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Herramienta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
