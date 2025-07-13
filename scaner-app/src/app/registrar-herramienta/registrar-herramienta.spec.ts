import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarHerramientaComponent } from './registrar-herramienta';

describe('RegistrarHerramientaComponent', () => {
  let component: RegistrarHerramientaComponent;
  let fixture: ComponentFixture<RegistrarHerramientaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarHerramientaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarHerramientaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
