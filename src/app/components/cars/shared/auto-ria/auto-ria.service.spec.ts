import { TestBed } from '@angular/core/testing';

import { AutoRiaService } from './auto-ria.service';

describe('AutoRiaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutoRiaService = TestBed.get(AutoRiaService);
    expect(service).toBeTruthy();
  });
});
