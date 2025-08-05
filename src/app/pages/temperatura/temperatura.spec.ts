import { TestBed } from '@angular/core/testing';

import { Temperatura } from './temperatura.service';

describe('Temperatura', () => {
  let service: Temperatura;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Temperatura);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
