import { TestBed } from '@angular/core/testing';

import { VrijgeocoderService } from './vrijgeocoder.service';

describe('VrijgeocoderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VrijgeocoderService = TestBed.get(VrijgeocoderService);
    expect(service).toBeTruthy();
  });
});
