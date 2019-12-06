import { TestBed } from '@angular/core/testing';

import { SpoorwegenService } from './spoorwegen.service';

describe('SpoorwegenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpoorwegenService = TestBed.get(SpoorwegenService);
    expect(service).toBeTruthy();
  });
});
