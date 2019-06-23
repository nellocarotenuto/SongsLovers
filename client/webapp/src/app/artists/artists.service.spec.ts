import { TestBed } from '@angular/core/testing';

import { ArtistsService } from './artists.service';

describe('ArtistsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtistsService = TestBed.get(ArtistsService);
    expect(service).toBeTruthy();
  });
});
