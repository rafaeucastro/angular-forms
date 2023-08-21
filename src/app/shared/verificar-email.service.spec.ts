import { TestBed } from '@angular/core/testing';

import { VerificarEmailService } from './verificar-email.service';

describe('VerificarEmailService', () => {
  let service: VerificarEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificarEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
