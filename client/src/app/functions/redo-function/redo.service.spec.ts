import { TestBed } from '@angular/core/testing';

import { RedoService } from './redo.service';

describe('RedoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedoService = TestBed.get(RedoService);
    expect(service).toBeTruthy();
  });
});
