import { TestBed } from '@angular/core/testing';

import { LayerconfigService } from './layerconfig.service';

describe('LayerconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayerconfigService = TestBed.get(LayerconfigService);
    expect(service).toBeTruthy();
  });
});
