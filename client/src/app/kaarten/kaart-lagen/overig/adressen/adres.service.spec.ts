import { TestBed } from '@angular/core/testing';

import { AdresService } from './adres.service';

describe('AdresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdresService = TestBed.get(AdresService);
    expect(service).toBeTruthy();
  });
});
