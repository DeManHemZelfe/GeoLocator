import { TestBed } from '@angular/core/testing';

import { GrenzenService } from './grenzen.service';

describe('GrenzenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrenzenService = TestBed.get(GrenzenService);
    expect(service).toBeTruthy();
  });
});
