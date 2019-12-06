import { TestBed } from '@angular/core/testing';

import { OverigedienstenService } from './overigediensten.service';

describe('OverigedienstenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverigedienstenService = TestBed.get(OverigedienstenService);
    expect(service).toBeTruthy();
  });
});
