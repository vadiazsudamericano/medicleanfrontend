import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Herramientaspartedos } from './herramientaspartedos';

describe('Herramientaspartedos', () => {
  let component: Herramientaspartedos;
  let fixture: ComponentFixture<Herramientaspartedos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Herramientaspartedos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Herramientaspartedos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
