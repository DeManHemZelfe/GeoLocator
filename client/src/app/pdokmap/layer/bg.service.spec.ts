import { TestBed } from '@angular/core/testing';

import { BgService } from './bg.service';

describe('BgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BgService = TestBed.get(BgService);
    expect(service).toBeTruthy();
  });
});
