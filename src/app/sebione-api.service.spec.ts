import { TestBed } from '@angular/core/testing';

import { SebioneApiService } from './sebione-api.service';

describe('SebioneApiService', () => {
  let service: SebioneApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SebioneApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
