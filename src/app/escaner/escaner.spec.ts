import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Escaner } from './escaner';

describe('Escaner', () => {
  let component: Escaner;
  let fixture: ComponentFixture<Escaner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escaner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Escaner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
