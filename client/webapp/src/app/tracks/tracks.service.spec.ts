import { TestBed } from '@angular/core/testing';

import { TracksService } from './tracks.service';

describe('TracksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TracksService = TestBed.get(TracksService);
    expect(service).toBeTruthy();
  });
});
