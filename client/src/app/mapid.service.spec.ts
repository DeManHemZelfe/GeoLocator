import { TestBed } from '@angular/core/testing';

import { MapidService } from './mapid.service';

describe('MapidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapidService = TestBed.get(MapidService);
    expect(service).toBeTruthy();
  });
});
