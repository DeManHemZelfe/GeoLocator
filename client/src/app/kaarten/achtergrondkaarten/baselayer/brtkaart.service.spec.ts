import { TestBed } from '@angular/core/testing';

import { BrtkaartService } from './brtkaart.service';

describe('BrtkaartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrtkaartService = TestBed.get(BrtkaartService);
    expect(service).toBeTruthy();
  });
});
