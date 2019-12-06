import { TestBed } from '@angular/core/testing';

import { VisbuttonService } from './visbutton.service';

describe('VisbuttonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisbuttonService = TestBed.get(VisbuttonService);
    expect(service).toBeTruthy();
  });
});
