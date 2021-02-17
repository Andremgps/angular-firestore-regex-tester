import { TestBed } from '@angular/core/testing';

import { RegexListService } from './regex-list.service';

describe('RegexListService', () => {
  let service: RegexListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegexListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
