import { TestBed } from '@angular/core/testing';

import { InitmapService } from './initmap.service';

describe('InitmapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InitmapService = TestBed.get(InitmapService);
    expect(service).toBeTruthy();
  });
});
