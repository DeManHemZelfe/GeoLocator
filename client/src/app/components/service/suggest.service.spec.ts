import { TestBed } from '@angular/core/testing';

import { SuggestService } from './suggest.service';

describe('SuggestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuggestService = TestBed.get(SuggestService);
    expect(service).toBeTruthy();
  });
});
