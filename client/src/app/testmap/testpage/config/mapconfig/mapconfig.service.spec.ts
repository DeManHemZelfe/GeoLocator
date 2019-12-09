import { TestBed } from '@angular/core/testing';

import { MapconfigService } from './mapconfig.service';

describe('MapconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapconfigService = TestBed.get(MapconfigService);
    expect(service).toBeTruthy();
  });
});
