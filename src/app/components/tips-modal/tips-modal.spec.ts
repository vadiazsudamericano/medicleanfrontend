import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsModal } from './tips-modal';

describe('TipsModal', () => {
  let component: TipsModal;
  let fixture: ComponentFixture<TipsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
